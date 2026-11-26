import { useState } from 'react';

import { BarChart, LineChart } from '../components/charts.tsx';
import { DataTable } from '../components/DataTable.tsx';
import { Async, Card, Kpi, PageHead, Unavailable } from '../components/ui.tsx';
import { usePanel } from '../lib/context.tsx';
import { fmtDec, fmtInt, fmtMs, fmtPct, fmtSeconds, langName } from '../lib/format.ts';
import { aggregate } from '../lib/period.ts';
import { useRpc } from '../lib/rpc.ts';
import { GrainToggle, SectionTitle, useGrain, usePeriodArgs, type Json } from './shared.tsx';

export function Learning() {
  const { args, refreshKey } = usePeriodArgs();
  const { filters } = usePanel();
  const [level, setLevel] = useState('');
  const [minAttempts, setMinAttempts] = useState(5);
  const [grain, setGrain] = useGrain();
  const state = useRpc<Json>(
    'admin_learning',
    { ...args, p_filters: { ...args.p_filters, ...(level ? { level } : {}) }, p_min_attempts: minAttempts },
    refreshKey,
  );
  return (
    <>
      <PageHead title="Aprendizaje">
        Cómo aprenden: volumen, precisión, tiempos y dónde se traban. En este módulo «idioma» y «nivel» filtran el contenido
        {filters.language ? ` (${langName(filters.language)})` : ''}.
      </PageHead>
      <div className="controls">
        <select className="select" aria-label="Nivel" value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">Todos los niveles</option>
          {['A1', 'A2', 'B1', 'B2'].map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <label className="muted" style={{ fontSize: 13 }}>
          Mínimo de intentos para «más difíciles»{' '}
          <select className="select" value={minAttempts} onChange={(e) => setMinAttempts(Number(e.target.value))}>
            {[1, 3, 5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Async state={state} rows={6}>
        {(d) => {
          const t = d.totals;
          const agg = aggregate(d.series, grain, { lessons: 'sum', reviews: 'sum', learners: 'avg' });
          return (
            <>
              <div className="grid kpis">
                <Kpi metric="lessons_completed" value={t.lessons_completed} />
                <Kpi label="Lecciones iniciadas" value={null} unavailable={d.unavailable.lessons_started} />
                <Kpi metric="reviews_completed" value={t.reviews_completed} />
                <Kpi metric="learners" value={t.learners} />
                <Kpi metric="units_completed" value={t.units_completed} />
                <Kpi metric="exercises_answered" label="Respuestas" value={t.answers} />
                <Kpi label="Correctas" value={t.correct} />
                <Kpi label="Incorrectas" value={t.incorrect} />
                <Kpi metric="accuracy" value={t.accuracy} format={fmtPct} />
                <Kpi metric="first_try_accuracy" value={t.first_try_accuracy} format={fmtPct} />
                <Kpi metric="avg_response_ms" value={t.avg_response_ms} format={fmtMs} />
                <Kpi metric="median_response_ms" value={t.median_response_ms} format={fmtMs} />
                <Kpi metric="avg_lesson_seconds" value={t.avg_lesson_seconds} format={fmtSeconds} />
                <Kpi label="Respuestas de repaso" value={t.review_answers} formula="Suma de total_answers de los repasos completados." />
              </div>
              <Card title="Evolución" actions={<GrainToggle grain={grain} setGrain={setGrain} />}>
                <LineChart
                  data={agg}
                  series={[
                    { key: 'lessons', label: 'Lecciones' },
                    { key: 'reviews', label: 'Repasos' },
                  ]}
                  csvName="aprendizaje-evolucion"
                />
              </Card>
              <div className="grid cols-2">
                <Card title="Por curso (idioma)" info="Lecciones completadas, usuarios y precisión al primer intento por idioma del contenido.">
                  <DataTable
                    csvName="aprendizaje-por-curso"
                    rows={d.by_course}
                    columns={[
                      { key: 'language', label: 'Idioma', render: (r) => langName(r.language) },
                      { key: 'learners', label: 'Usuarios', num: true },
                      { key: 'lessons', label: 'Lecciones', num: true },
                      { key: 'accuracy', label: 'Precisión', num: true, render: (r) => fmtPct(r.accuracy) },
                      { key: 'avg_seconds', label: 'Tiempo medio', num: true, render: (r) => fmtSeconds(r.avg_seconds) },
                    ]}
                  />
                </Card>
                <Card title="Por nivel">
                  <DataTable
                    rows={d.by_level}
                    columns={[
                      { key: 'level', label: 'Nivel' },
                      { key: 'learners', label: 'Usuarios', num: true },
                      { key: 'lessons', label: 'Lecciones', num: true },
                      { key: 'accuracy', label: 'Precisión', num: true, render: (r) => fmtPct(r.accuracy) },
                    ]}
                  />
                  <h3 style={{ fontSize: 13, margin: '16px 0 8px' }}>Nivel de inicio (todas las inscripciones)</h3>
                  <BarChart
                    label="Usuarios"
                    data={(d.start_levels as Json[]).map((r) => ({ label: r.level === '??' ? 'Sin dato' : r.level, value: Number(r.users) }))}
                    height={160}
                  />
                </Card>
                <Card title="Por habilidad" info="exercise_attempts.skill">
                  <DataTable
                    rows={d.by_skill}
                    columns={[
                      { key: 'skill', label: 'Habilidad' },
                      { key: 'answers', label: 'Respuestas', num: true },
                      { key: 'accuracy', label: 'Precisión', num: true, render: (r) => fmtPct(r.accuracy) },
                      { key: 'avg_ms', label: 'Tiempo', num: true, render: (r) => fmtMs(r.avg_ms) },
                    ]}
                  />
                </Card>
                <Card title="Por tipo de ejercicio" info="exercises.type; «repaso_palabra» = respuestas de repaso sin ejercicio asociado.">
                  <DataTable
                    rows={d.by_type}
                    columns={[
                      { key: 'type', label: 'Tipo' },
                      { key: 'answers', label: 'Respuestas', num: true },
                      { key: 'accuracy', label: 'Precisión', num: true, render: (r) => fmtPct(r.accuracy) },
                      { key: 'avg_ms', label: 'Tiempo', num: true, render: (r) => fmtMs(r.avg_ms) },
                    ]}
                  />
                </Card>
              </div>
              <SectionTitle>Dónde se traban</SectionTitle>
              <Card title="Ejercicios con menor precisión" sub={`con al menos ${minAttempts} intentos`}>
                <DataTable
                  csvName="ejercicios-dificiles"
                  rows={d.hardest_exercises}
                  empty="Ningún ejercicio alcanza el mínimo de intentos en el período."
                  columns={[
                    { key: 'exercise_id', label: 'Ejercicio', render: (r) => <span className="mono">{String(r.exercise_id)}</span> },
                    { key: 'type', label: 'Tipo' },
                    { key: 'language', label: 'Idioma', render: (r) => langName(r.language) },
                    { key: 'level', label: 'Nivel' },
                    { key: 'attempts', label: 'Intentos', num: true },
                    { key: 'accuracy', label: 'Precisión', num: true, render: (r) => fmtPct(r.accuracy) },
                    { key: 'avg_ms', label: 'Tiempo', num: true, render: (r) => fmtMs(r.avg_ms) },
                  ]}
                />
              </Card>
              <div className="grid cols-2">
                <Card title="Lecciones más difíciles" info="Menor precisión al primer intento entre las lecciones con suficientes completadas.">
                  <DataTable
                    csvName="lecciones-dificiles"
                    rows={d.hardest_lessons}
                    empty="Pocas lecciones completadas para comparar."
                    columns={[
                      { key: 'title', label: 'Lección' },
                      { key: 'language', label: 'Idioma', render: (r) => langName(r.language) },
                      { key: 'level', label: 'Nivel' },
                      { key: 'completions', label: 'Completadas', num: true },
                      { key: 'accuracy', label: 'Precisión', num: true, render: (r) => fmtPct(r.accuracy) },
                    ]}
                  />
                </Card>
                <Card title="Lecciones más hechas">
                  <DataTable
                    rows={d.top_lessons}
                    columns={[
                      { key: 'title', label: 'Lección' },
                      { key: 'language', label: 'Idioma', render: (r) => langName(r.language) },
                      { key: 'level', label: 'Nivel' },
                      { key: 'completions', label: 'Completadas', num: true },
                      { key: 'learners', label: 'Usuarios', num: true },
                    ]}
                  />
                </Card>
              </div>
              <Card title="Rachas de aprendizaje" info="Días consecutivos en user_daily_activity más días congelados; la racha actual cuenta si llega a hoy o ayer.">
                <div className="grid cols-3">
                  <Kpi label="Usuarios con racha" value={d.streaks.users_with_streak} />
                  <Kpi label="Racha media" value={d.streaks.avg_current} format={(v) => fmtDec(v)} />
                  <Kpi label="Mejor racha histórica" value={d.streaks.max_best} />
                </div>
                <div style={{ marginTop: 12 }}>
                  <BarChart
                    label="Usuarios"
                    data={(d.streaks.buckets as Json[]).map((b) => ({ label: `${b.bucket} d`, value: Number(b.users) }))}
                    height={160}
                    yFormat={fmtInt}
                  />
                </div>
              </Card>
              <Unavailable items={d.unavailable} />
            </>
          );
        }}
      </Async>
    </>
  );
}
