// 3rd's
import type { FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';

// locals
import FetchFactory from '../factory';

type IExam = {
  id: number | null;
  name: string;
}

class ProductsModule extends FetchFactory<IExam[]> {
  private RESOURCE = '/exams';

  /**
   * Return the products as array 
   * @param asyncDataOptions options for `useAsyncData`
   * @returns 
   */
  async getExams(
    asyncDataOptions?: AsyncDataOptions<IExam[]>
  ) {

    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {
          headers: {
            'Accept-Language': 'en-US'
          }
        };
        return this.call(
          'GET',
          `${this.RESOURCE}`,
          undefined, // body
          fetchOptions
        )
      },
      asyncDataOptions
    ) 
  }
}

export default ProductsModule;