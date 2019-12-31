import { useLocation } from "react-router-dom";
import { toQueryObject } from "../helpers/toQueryObject";

export function useQuery() {
    return toQueryObject(useLocation().search);
}
