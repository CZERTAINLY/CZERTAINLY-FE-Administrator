import CustomTable, { TableHeader, TableDataRow } from 'components/CustomTable';
import Widget from 'components/Widget';
import WidgetButtons, { WidgetButtonProps } from 'components/WidgetButtons';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { ComplianceProfileDtoV2, Resource, ResourceObjectDto } from 'types/openapi/models';
import { LockWidgetNameEnum } from 'types/user-interface';

import { actions, selectors } from 'ducks/compliance-profiles';
import ProfileAssociationsDialog from 'components/_pages/compliance-profiles/detail/ProfileAssociations/ProfileAssociationsDialog';

interface Props {
    profile: ComplianceProfileDtoV2 | undefined;
}

export default function ProfileAssociations({ profile }: Props) {
    const dispatch = useDispatch();
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const associationsOfComplianceProfile = useSelector(selectors.associationsOfComplianceProfile);
    const [isAssociateFrofileModalOpen, setIsAssociateFrofileModalOpen] = useState(false);

    const raProfileHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'raProfileName',
                content: 'Name',
            },
            { id: 'resource', content: 'Resource' },
            { id: 'object', content: 'Object' },
            {
                id: 'action',
                content: 'Action',
            },
        ],
        [],
    );

    const onDissociateRaProfile = useCallback(
        (resource: Resource, associatedProfileUuid: string) => {
            if (!profile) return;

            dispatch(
                actions.dissociateComplianceProfile({
                    uuid: profile.uuid,
                    resource: resource,
                    associationObjectUuid: associatedProfileUuid,
                }),
            );
        },
        [profile, dispatch],
    );

    const raProfileData: TableDataRow[] = useMemo(
        () =>
            !associationsOfComplianceProfile || !profile
                ? []
                : associationsOfComplianceProfile.map((associatedProfile) => ({
                      id: associatedProfile.objectUuid,
                      columns: [
                          <Link to={`../../raprofiles/detail/${profile.uuid}/${associatedProfile.objectUuid}`}>
                              {associatedProfile!.name}
                          </Link>,

                          associatedProfile.resource,
                          associatedProfile.objectUuid,
                          <WidgetButtons
                              justify="start"
                              buttons={[
                                  {
                                      icon: 'minus-square',
                                      disabled: false,
                                      tooltip: 'Remove',
                                      onClick: () => {
                                          onDissociateRaProfile(associatedProfile.resource, associatedProfile.objectUuid);
                                      },
                                  },
                              ]}
                          />,
                      ],
                  })),
        [associationsOfComplianceProfile, profile, onDissociateRaProfile],
    );

    const raProfileButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Associate Profile',
                onClick: () => {
                    setIsAssociateFrofileModalOpen(true);
                },
            },
        ],
        [],
    );

    return (
        <>
            <Widget
                title="Associations"
                busy={isFetchingDetail}
                widgetButtons={raProfileButtons}
                titleSize="large"
                widgetLockName={LockWidgetNameEnum.ComplianceProfileDetails}
                lockSize="large"
            >
                <CustomTable headers={raProfileHeaders} data={raProfileData} />
            </Widget>
            <ProfileAssociationsDialog
                isOpen={isAssociateFrofileModalOpen}
                onClose={() => setIsAssociateFrofileModalOpen(false)}
                profile={profile}
                associationsOfComplianceProfile={associationsOfComplianceProfile}
            />
        </>
    );
}
