import { fireEvent, render, screen } from '@testing-library/react-native';

import { ReportPhotoButton } from '../components/ReportPhotoButton';

const mockMutate = jest.fn();
let mockState: Record<string, unknown> = {};
jest.mock('../hooks', () => ({
  useReportAvatar: () => ({
    mutate: mockMutate,
    reset: jest.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
    ...mockState,
  }),
}));

beforeEach(() => {
  mockMutate.mockClear();
  mockState = {};
});

it('pide un motivo y envía el elegido', async () => {
  await render(<ReportPhotoButton userId="u2" username="bob" hasPhoto />);
  await fireEvent.press(screen.getByLabelText('Reportar la foto de perfil de bob'));
  expect(screen.getByText('Reportar foto de perfil')).toBeTruthy();

  await fireEvent.press(screen.getByText('Enviar reporte'));
  expect(mockMutate).not.toHaveBeenCalled();

  await fireEvent.press(screen.getByText('Se hace pasar por otra persona'));
  await fireEvent.press(screen.getByText('Enviar reporte'));
  expect(mockMutate).toHaveBeenCalledWith('impersonation', expect.anything());
});

it('sin foto no muestra el botón, pero sí el aviso de un reporte enviado', async () => {
  const { rerender } = await render(
    <ReportPhotoButton userId="u2" username="bob" hasPhoto={false} />,
  );
  expect(screen.queryByText('Reportar foto')).toBeNull();

  mockState = { isSuccess: true, data: { reported: true, hidden: true } };
  await rerender(<ReportPhotoButton userId="u2" username="bob" hasPhoto={false} />);
  expect(screen.getByText('Gracias por avisar. La foto se ocultó.')).toBeTruthy();
});
