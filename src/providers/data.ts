import {createDataProvider, CreateDataProviderOptions} from "@refinedev/rest";
import {BACKEND_BASE_URL} from "../../constants";
import {ListResponse} from "../../types";

// NOTE: This file defines the options object that can be provided to
// `createDataProvider(options)` so that refine knows how to build requests and
// interpret responses for list queries.
//
// Currently we only define the `getList` behavior:
// - `getEndpoint`: how to resolve the URL path for a given resource
// - `mapResponse`: how to extract the array of records from the raw `fetch` Response
// - `getTotalCount`: how to calculate the total number of records (for pagination)
//

// Create endpoints configuration for list fetching
const options: CreateDataProviderOptions = {
  getList: {
    // Build the endpoint for the given resource name (e.g., "subjects" → "/subjects")
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ resource, pagination, filters}) => {

      const page = pagination?.currentPage ?? 1;  //coming from backend
      const pageSize = pagination?.pageSize ?? 10;

      const params: Record<string, string|number> = { page, limit: pageSize};

    //   loop through all refine filters
      filters?.forEach((filter) => {
        // extract field     if exists filter.field or empty str
        const field = 'field' in filter ? filter.field: '';

      //   convert filter val to str for query params
        const value = String(filter.value);

      //   Handle filter only for subjects resource
        if(resource === 'subjects') {
          if(field === 'department') params.department = value;
          if(field === 'name' || field === 'code') params.search = value;
        }
      })

      return params;

    },

    // Convert the raw Response into the array of records expected by refine lists
    // Use response.clone() so we don't consume the body twice when getTotalCount also reads it
    mapResponse: async (response) => {
      const payload: ListResponse = await response.clone().json();
      // Many APIs return `{ data: [...] }`; if not present, default to empty array
      return payload.data ?? [];
    },

    // Provide total count used by refine's pagination controls
    getTotalCount: async (response) => {
      const payload: ListResponse = await response.json();
      // Prefer explicit pagination total; fallback to the array length; then 0
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },
}

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };