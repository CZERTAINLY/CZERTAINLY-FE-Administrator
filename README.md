# CZERTAINLY Administrator User Interface

> This repository is part of the commercial open-source project CZERTAINLY. You can find more information about the project at [CZERTAINLY](https://github.com/3KeyCompany/CZERTAINLY) repository, including the contribution guide.

Administrator User Interface or commonly called as Admin UI consists of the administrative web interface where various administrative tasks can be performed on top of the platform by the administrators.

Admin UI contains the following menu items:

| Menu item      | Short Description                                                                                                                                                                                                                                                                      |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Home           | Contains useful links and description of the platform                                                                                                                                                                                                                                  |
| Dashboard      | `Dashboard` contains the comprehensive and intuitive charts of `Certificates` based on various factors like expiration, type, `Group` etc... `Dashboard` provides a quick overview about the health of the PKI                                                                         |
| RA Profile     | Management of `RA Profiles` including creating a new `RA Profile`, enable/disable operations, authorizing a new `Client`, edit and delete a `RA Profile`                                                                                                                               |
| Administrators | Provides list of available `Administrators` including the action on each `Administrator` and other related operations                                                                                                                                                                  |
| Clients        | List of `Clients` who are authorized to use the platform and the access to `RA Profiles` on each `Client` can be controlled from the `Client` pages                                                                                                                                    |
| Connectors     | Provides an overview of available `Connectors`, their details and status. Operations on the `Connectors` like `Approvals`, reconnection on each or multiple `Connectors` can be performed on this page                                                                                 |
| Credentials    | List of all the `Credentials` added to the platform. These `Credentials` are used only for the `Connector` related operations and do not contain any platform authorization related items                                                                                              |
| Authorities    | List of Authority instances added and the action on each `Authority`. These `Authorities` can be added based on the `Connectors` available in the platform                                                                                                                             |
| ACME           | Management of `ACME Profiles` and `ACME Accounts`                                                                                                                                                                                                                                      |
| Groups         | `Groups` can mainly be used for logical grouping of `Certificates` by categories or teams or application. `Group` page contains the list of available `Groups` to which the `Certificates` can be tagged                                                                               |
| Entities       | The `entity` that is managed by the `Entity Provider`. Entities are comprised of multiple locations                                                                                                            |
| Location | The `location` of the `entity` that is managed by the `Entity Provider`. Location is the object that contains the details of the certificates and information about where they are currently deployed. A Single location can have more than one certificates |
| Discovery      | List of all the `Discoveries` performed through the platform. It also provides the option to create a new `Discovery` and to view the details of an existing `Discovery`. Initiating the `Discovery` is dependent on the list of available `Connectors` that are added to the platform |
| Compliance Profiles | Management of `Compliance Profiles` including creating a new `Compliance Profile`, enable/disable operations, edit and delete a `Compliance Profile`. `Compliance Profile` comprises of the list of `Compliance Rules` and `Compliance Groups` based on which the certificates will be checked for compliance. |
| Audit Logs     | Audit log records all operations on CZERTAINLY to reconstruct any event in case of investigation. It also proves the compliance with the various standards and regulations, such as PCI DSS, ISO 27k, GDPR, Web Trust, etc.                                                            |
| About          | About CZERTAINLY, support contacts and other relevant information                                                                                                                                                                                                                      |

### Details of Objects

The links and pages are constructed in a way to make the navigation between the pages easier. To view the details of any object the user can simply click on the name to be redirected to the detailed view.

### Icons and Tooltip

For the ease of understanding and usage, the Icons are added with tooltip to understand the actions it provides when needed.

### Operations

Bulk operations can be performed on most of the objects from their list page. To perform any operation on a single object (for example - a connector), the user can do it either from the list page or the details page.

For more information, refer to the [CZERTAINLY documentation](https://docs.czertainly.com).

> Administrator UI Consists of operation related only to the management and perform administrative tasks on the platform. This does not provide CLM related operations. For the details of CLM related operations please refer to Operator UI section of the [CZERTAINLY documentation](https://docs.czertainly.com).

## Docker container

Admin Web Interface is provided as a Docker container. Use the `docker pull harbor.3key.company/czertainly/czertainly-frontend-administrator:tagname` to pull the required image from the repository. It can be configured using the following environment variables:

| Variable       | Description                                                        | Required | Default value     |
|----------------|--------------------------------------------------------------------|----------|-------------------|
| `BASE_URL`     | URL Path of the frontend application                               | No       | `/administrator`  |
| `API_URL`      | URL Path of the CZERTAINLY API for the web application             | No       | `/api`            |
| `LOGIN_URL`    | URL Path of the login page                                         | No       | `/login`          |
| `LOGOUT_URL`   | URL Path of the logout page                                        | No       | `/logout`         |

* Default variable values are defined in the Dockerfile
