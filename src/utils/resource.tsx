import { Link } from "react-router-dom";
import { Resource } from "types/openapi";

export const getResourceLinkFromNameAndUuid = (resourceName: Resource, uuid: string) => (
    <Link to={`/${resourceName}/detail/${uuid}`}>{resourceName}</Link>
);
