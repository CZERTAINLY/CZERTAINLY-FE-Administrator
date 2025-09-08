import { CertificateGroupResponseModel } from 'types/certificateGroups';
import { UserDto } from 'types/openapi';

export const mockData = {
    users: [
        {
            uuid: 'user-1',
            username: 'john.doe',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            enabled: true,
            systemUser: false,
        },
        {
            uuid: 'user-2',
            username: 'jane.smith',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            enabled: true,
            systemUser: false,
        },
        {
            uuid: 'user-3',
            username: 'bob.johnson',
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob.johnson@example.com',
            enabled: true,
            systemUser: false,
        },
    ] as UserDto[],

    groups: [
        {
            uuid: '03af02ef-cdac-4943-b8d6-8e55d3466fe8',
            name: '3key-info',
            description: 'For the notifications to 3Key',
            email: 'info@3key.company',
        },
        {
            uuid: '1fa64e9a-1a34-4e87-a7dc-4ed55e3021a5',
            name: 'ABCDEF',
            description: 'a',
            email: '',
        },
    ] as CertificateGroupResponseModel[],
};
