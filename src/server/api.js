import axios from "axios";
import { BASE_URL, xAuth } from "./constants"

export async function fetchData(data) {
    try {
        const response = await axios.post(BASE_URL, data, {
            headers: {
                "X-Auth": xAuth,
            },
        });

        const ids = response.data.result;

        const fetchByIds = await axios.post(
            BASE_URL,
            {
                action: "get_items",
                params: { ids: ids },
            },
            {
                headers: {
                    "X-Auth": xAuth,
                },
            }
        );

        return fetchByIds.data.result;

    } catch (error) {
        throw new Error(error);
    }
}
