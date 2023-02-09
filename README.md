# CZERTAINLY Administrator User Interface

> This repository is part of the commercial open-source project CZERTAINLY. You can find more information about the project at [CZERTAINLY](https://github.com/3KeyCompany/CZERTAINLY) repository, including the contribution guide.

Administrator User Interface or commonly called as Admin UI consists of the administrative web interface where various administrative tasks can be performed on top of the platform by the administrators.

### Details of objects

The links and pages are constructed in a way to make the navigation between the pages easier. To view the details of any object the user can simply click on the name to be redirected to the detailed view.

### Icons and tooltips

For the ease of understanding and usage, the icons are added with tooltip to understand the actions it provides when needed.

### Operations

Bulk operations can be performed on most of the objects from their list page. To perform any operation on a single object (for example - a connector), the user can do it either from the list page or the details page.

For more information, refer to the [CZERTAINLY documentation](https://docs.czertainly.com).

## Docker container

Admin Web Interface is provided as a Docker container. Use the `docker pull 3keycompany/czertainly-frontend-administrator:tagname` to pull the required image from the repository. It can be configured using the following environment variables:

| Variable     | Description                                            | Required                                      | Default value    |
|--------------|--------------------------------------------------------|-----------------------------------------------|------------------|
| `BASE_URL`   | URL Path of the frontend application                   | ![](https://img.shields.io/badge/-NO-red.svg) | `/administrator` |
| `API_URL`    | URL Path of the CZERTAINLY API for the web application | ![](https://img.shields.io/badge/-NO-red.svg) | `/api`           |
| `LOGIN_URL`  | URL Path of the login page                             | ![](https://img.shields.io/badge/-NO-red.svg) | `/login`         |
| `LOGOUT_URL` | URL Path of the logout page                            | ![](https://img.shields.io/badge/-NO-red.svg) | `/logout`        |