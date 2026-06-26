# Testing Guidelines (Jest)

Every core backend component (Adapters, Use Cases, API Routes) must have associated tests ensuring resilience and accuracy.

## 1. Test Requirements
For each logical component, write:
1. **Happy Path**: Verifies correct outputs and status codes when dependencies respond successfully.
2. **Error Path**: Verifies graceful error handling, status codes (e.g., 500, 404, 400), and fallback actions (e.g., pulling cached data when an API is down).

---

## 2. Test Execution
All test commands run from the `codigo/` directory:
- **Run all tests**: `npm run test --prefix codigo`
- **Run tests in watch mode**: `npm run test:watch --prefix codigo`

---

## 3. Mocking Strategy

### Mocking Supabase
Since tests run locally and should not mutate production databases:
* Use Jest mocks for `@supabase/supabase-js`.
* Stub queries to match successful data returns or throw explicit PgErrors.

### Mocking External APIs (`latinfo.dev`)
* Intercept `fetch` commands using `jest.spyOn(global, 'fetch')` or mocking the HTTP client.
* Return mock JSON schemas representing SUNAT/OSCE answers.

---

## 4. Test Templates (Example)

### Use Case Test (`SearchCompanies.test.ts`)
```typescript
import { SearchCompanies } from '../../domain/usecases/SearchCompanies';
import { CompanyRepository } from '../../domain/repositories/CompanyRepository';

describe('SearchCompanies Use Case', () => {
  let mockRepo: jest.Mocked<CompanyRepository>;
  let useCase: SearchCompanies;

  beforeEach(() => {
    mockRepo = {
      search: jest.fn(),
      getByRuc: jest.fn(),
    } as any;
    useCase = new SearchCompanies(mockRepo);
  });

  // HAPPY PATH
  it('should return a list of companies when search is successful', async () => {
    const mockCompanies = [{ ruc: '20100047218', razonSocial: 'Los Quenuales', region: 'La Libertad' }];
    mockRepo.search.mockResolvedValue(mockCompanies);

    const result = await useCase.execute('Quenuales');

    expect(result).toEqual(mockCompanies);
    expect(mockRepo.search).toHaveBeenCalledWith('Quenuales');
  });

  // ERROR PATH
  it('should propagate repository errors upward', async () => {
    mockRepo.search.mockRejectedValue(new Error('Database timeout'));

    await expect(useCase.execute('Quenuales')).rejects.toThrow('Database timeout');
  });
});
```

### Adapter Test with Fallback (`LatinfoAdapter.test.ts`)
```typescript
import { LatinfoAdapter } from './LatinfoAdapter';

describe('LatinfoAdapter', () => {
  let adapter: LatinfoAdapter;
  let mockCache: any;

  beforeEach(() => {
    mockCache = {
      get: jest.fn(),
      save: jest.fn(),
    };
    adapter = new LatinfoAdapter(mockCache);
  });

  // HAPPY PATH
  it('should fetch from latinfo.dev API and save to cache', async () => {
    const mockApiResponse = { ruc: '20100047218', oefa_sanctions: [] };
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    } as any);

    const data = await adapter.getCompanyData('20100047218');

    expect(data).toEqual(mockApiResponse);
    expect(mockCache.save).toHaveBeenCalledWith('20100047218', mockApiResponse);
  });

  // ERROR PATH (FALLBACK IN ACTION)
  it('should fall back to cache when external API returns a 500 error', async () => {
    const mockCachedData = { ruc: '20100047218', oefa_sanctions: [{ id: 1 }] };
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
    } as any);
    mockCache.get.mockResolvedValue(mockCachedData);

    const data = await adapter.getCompanyData('20100047218');

    expect(data).toEqual(mockCachedData);
    expect(mockCache.get).toHaveBeenCalledWith('20100047218');
  });
});
```
