export function jsxInnerText(obj: JSX.Element): string {
    var buf = '';

    if (obj) {
        var type = typeof obj;

        if (type === 'string' || type === 'number' || type === 'boolean') {
            buf += obj.toString();
        } else if (type === 'object') {
            var children = null;

            if (Array.isArray(obj)) {
                children = obj;
            } else {
                var props = obj.props;

                if (props) {
                    children = props.children;
                }
            }

            if (children) {
                if (Array.isArray(children)) {
                    children.forEach(function (o) {
                        buf += jsxInnerText(o);
                    });
                } else {
                    buf += jsxInnerText(children);
                }
            } else {
                if (props)
                    Object.getOwnPropertyNames(props).forEach((propName) => {
                        buf += propName;
                        buf += jsxInnerText(props[propName]);
                    });
            }
        }
    }

    return buf;
}
