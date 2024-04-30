class RouteAchitectApi {
    static setApiUrl(urlString) {
        RouteAchitectApi.urlString = urlString;
    }

    static async #fetching(routeName, opts = {}) {
        return await fetch(`${RouteAchitectApi.urlString}/${routeName}`, opts);
    }

    static async getCategories() {
        return await (await RouteAchitectApi.#fetching('categories')).json();
    }

    static async getWorks() {
        return await ((await RouteAchitectApi.#fetching('works')).json());
    }

    static async postUsersLogin(email, password) {
        const sessionUser = localStorage.getItem('sessionUser');

        if (!sessionUser) {
            return await RouteAchitectApi.#fetching('users/login', {
                method: 'post',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
        }
        return await RouteAchitectApi.#fetching('users/login', {
            method: 'post',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${JSON.parse(sessionUser).token}`,
            },
        });
    }

    static async postWorks(data) {
        const sessionUser = localStorage.getItem('sessionUser');

        if (!sessionUser) { throw 'Unauthorized post works.'; }
        return await RouteAchitectApi.#fetching('works', {
            method: 'post',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${JSON.parse(sessionUser).token}`,
            },
            body: data,
        });
    }

    static async deleteWorksId(id) {
        const sessionUser = localStorage.getItem('sessionUser');

        if (!sessionUser) { throw 'Unauthorized delete works.'; }
        return await RouteAchitectApi.#fetching(`works/${id}`, {
            method: 'delete',
            headers: {
                accept: '*/*',
                Authorization: `Bearer ${JSON.parse(sessionUser).token}`,
            },
        });
    }
}

export {
    RouteAchitectApi,
};
