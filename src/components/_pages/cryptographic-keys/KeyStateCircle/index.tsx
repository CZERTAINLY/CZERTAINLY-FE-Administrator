import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { useSelector } from 'react-redux';
import { KeyState, PlatformEnum } from 'types/openapi';

interface Props {
    state: KeyState;
}

function KeyStateCircle({ state }: Props) {
    const keyStateEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.KeyState));
    const stateText = getEnumLabel(keyStateEnum, state);
    const stateMap: { [key in KeyState]: { color: string; text: string } } = {
        [KeyState.Active]: { color: 'success', text: stateText },
        [KeyState.PreActive]: { color: 'dark', text: stateText },
        [KeyState.Compromised]: { color: 'danger', text: stateText },
        [KeyState.Destroyed]: { color: 'danger', text: stateText },
        [KeyState.Deactivated]: { color: 'warning', text: stateText },
        [KeyState.DestroyedCompromised]: { color: 'danger', text: stateText },
    };

    const _default = { color: 'secondary', text: stateText };

    const { color, text } = state ? stateMap[state] || _default : _default;

    return <i title={text} className={`fa fa-circle text-${color}`} />;
}

export default KeyStateCircle;
