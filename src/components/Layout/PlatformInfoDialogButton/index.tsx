import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Spinner from 'components/Spinner';
import { actions, selectors } from 'ducks/info';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCopyToClipboard } from 'utils/common-hooks';
import Button from 'components/Button';
import { Copy } from 'lucide-react';

const PlatformInfoDialogLink = () => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);

    const platformInfo = useSelector(selectors.platformInfo);
    const isFetching = useSelector(selectors.isFetching);

    const copyToClipboard = useCopyToClipboard();

    useEffect(() => {
        if (!isOpen) return;
        dispatch(actions.getPlatformInfo());
    }, [dispatch, isOpen]);

    const headers: TableHeader[] = useMemo(
        () => [
            {
                id: 'component',
                content: 'Component',
            },
            {
                id: 'version',
                content: 'Version',
            },
        ],
        [],
    );

    const data: TableDataRow[] = useMemo(
        () =>
            !platformInfo
                ? []
                : [
                      {
                          id: 'app',
                          columns: [platformInfo.app.name, platformInfo.app.version],
                      },
                      {
                          id: 'db',
                          columns: [platformInfo.db.system, platformInfo.db.version],
                      },
                  ],
        [platformInfo],
    );

    const content = useMemo(() => {
        if (!platformInfo) return;
        const copyText = `${platformInfo.app.name}: ${platformInfo.app.version}\n${platformInfo.db.system}: ${platformInfo.db.version}`;
        return (
            <div>
                <CustomTable data={data} headers={headers} />
                <div>
                    Click to copy:{' '}
                    <Button
                        className="mt-2"
                        variant="transparent"
                        title="Version Info"
                        onClick={() =>
                            copyToClipboard(
                                copyText,
                                'Platform version info was copied to clipboard',
                                'Failed to copy platform version info to clipboard',
                            )
                        }
                    >
                        <Copy size={16} />
                    </Button>
                </div>
            </div>
        );
    }, [platformInfo, copyToClipboard, data, headers]);

    return (
        <>
            <a
                href="#"
                className="text-blue-600"
                onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(true);
                }}
            >
                Version Info
            </a>
            <Dialog
                isOpen={isOpen}
                caption="Platform versions info"
                toggle={() => setIsOpen(false)}
                body={isFetching ? <Spinner active /> : content}
                size="lg"
                icon="info"
                buttons={[
                    {
                        color: 'secondary',
                        body: 'Close',
                        variant: 'outline',
                        onClick: () => setIsOpen(false),
                    },
                ]}
            />
        </>
    );
};

export default PlatformInfoDialogLink;
