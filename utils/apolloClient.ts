import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const APIURL =
    "https://api.thegraph.com/subgraphs/name/nonitmittal/multisig-delegate-wallet";

export async function executeQuery(query: string) {
    const client = new ApolloClient({
        uri: APIURL,
        cache: new InMemoryCache(),
    });

    return await client
        .query({
            query: gql(query),
        })
        .then((data) => {
            console.log("Query executed successfully!");
            return data.data;
        })
        .catch((error) => {
            console.log("Error while executing query: ", error);
        });
}
