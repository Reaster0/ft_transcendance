import { UserGuard } from './user.guard';

describe('ApiKeyGuard', () => {
  it('should be defined', () => {
    expect(new UserGuard()).toBeDefined();
  });
});
