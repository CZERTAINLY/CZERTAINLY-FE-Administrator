import {
   KeyState
} from "types/openapi";

interface Props {
   state: KeyState
}

function KeyStateCircle({ state }: Props) {

   const stateMap: { [key in KeyState] : { color: string, text: string } } = {
      [KeyState.Active]: { color: "success", text: "Active" },
      [KeyState.PreActive]: { color: "dark", text: "Pre Active" },
      [KeyState.Compromised]: { color: "danger", text: "Compromised" },
      [KeyState.Destroyed]: { color: "danger", text: "Destroyed" },
      [KeyState.Deactivated]: { color: "warning", text: "Deactivated" },
      [KeyState.CompromisedDestroyed]: { color: "danger", text: "Compromised-Destroyed" },
   }

   const _default = { color: "secondary", text: "Unknown" };

   const { color, text } = state ? (stateMap[state] || _default) : _default;

   return <i title={text} className={`fa fa-circle text-${color}`}/>;

}

export default KeyStateCircle;
