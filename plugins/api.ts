// 3rd's
import { $fetch } from 'ofetch';
import type { FetchOptions } from 'ofetch';

// locals
import ExamsModule from '~/repository/modules/exams';
import BooksModule from '~/repository/modules/books';

interface IApiInstance {
  exams: ExamsModule;
  books: BooksModule;
}

export default defineNuxtPlugin((_nuxtApp) => {
  const { token } = useAuth()

  const config = useRuntimeConfig();

  const fetchOptions: FetchOptions = {
    baseURL: config.public.apiUrl,
    headers: {
      Authorization: `${token.value}`,
    },
  };

  // Create a new instance of $fecther with custom option
  const apiFetcher = $fetch.create(fetchOptions);

  // An object containing all repositories we need to expose
  const modules: IApiInstance = {
    exams: new ExamsModule(apiFetcher),
    books: new BooksModule(apiFetcher),
  };

  return {
    provide: {
      api: modules
    }
  };
});