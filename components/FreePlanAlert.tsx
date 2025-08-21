import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export const FreePlanAlert = ({
  handleFreePlan,
  openDialog,
  setOpenDialog,
}: {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  handleFreePlan: () => Promise<void>;
}) => {
  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar cambio a plan gratuito</AlertDialogTitle>
          <AlertDialogDescription>
            Al cambiar de plan perderás tus créditos actuales ya que no son
            acumulables ¿Deseas continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setOpenDialog(false);
              handleFreePlan();
            }}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
