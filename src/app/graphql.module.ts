import { HttpLink } from 'apollo-angular/http';
import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

export const uri = 'http://77.223.96.15/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
    const basic = setContext((operation, context) => ({
        headers: {
            Accept: 'charset=utf-8',
        },
    }));

    const auth = setContext((operation, context) => {
        const token = localStorage.getItem('accessToken');

        if (token === null) {
            return {};
        } else {
            return {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
        }
    });

    const link = ApolloLink.from([basic, auth, httpLink.create({ uri })]);
    const cache = new InMemoryCache();

    return {
        link,
        cache
    };
}

@NgModule({
    exports: [ApolloModule],
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink],
        },
    ],
})
export class GraphQLModule {}
