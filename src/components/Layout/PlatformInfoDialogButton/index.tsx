import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Spinner from 'components/Spinner';
import { actions, selectors } from 'ducks/info';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import { useCopyToClipboard } from 'utils/common-hooks';

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
                <br />
                <div>
                    Click to copy:{' '}
                    <Button
                        className="btn btn-link py-0 px-1 ms-2"
                        color="white"
                        title="Version Info"
                        key="copy"
                        onClick={() =>
                            copyToClipboard(
                                copyText,
                                'Platform version info was copied to clipboard',
                                'Failed to copy platform version info to clipboard',
                            )
                        }
                    >
                        <i className="fa fa-copy" style={{ color: 'auto' }} />
                    </Button>
                </div>
            </div>
        );
    }, [platformInfo, copyToClipboard, data, headers]);

    return (
        <>
            <a
                href="#"
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
            />
        </>
    );
};

export default PlatformInfoDialogLink;
