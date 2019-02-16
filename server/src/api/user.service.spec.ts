import {MockConnection} from '../test/connection.stub';
import {user, dbUser} from '../test/fixtures';
import {UserService} from './user.service';
import {Users} from '../entity';
import { TableForeignKey } from 'typeorm';

describe('userService', () => {
    let mockConnection;
    let userService: UserService;
    let mockDb;
    let mockRepository;
    const hash = 'testHash';
    const hashService = {
        genHash: jasmine.createSpy().and.returnValue(hash),
    };
    describe('when a user is being created', () => {
        describe('and user has not already been created', () => {
            const mockUser = new Users();
            beforeEach(() => {
                mockRepository = {
                    find: () => [],
                };
                mockDb = {
                    manager: jasmine.createSpyObj('manager', ['save']),
                    getRepository: (...params) => {
                        return mockRepository;
                    },
                };
                mockConnection = new MockConnection(mockDb);
                mockUser.username = user.username;
                mockUser.password = hash;
            }),
            it('should save new user to db', () => {
                userService = new UserService(mockConnection, hashService),
                userService.create(user).then((res) => {
                    expect(mockDb.manager.save).toHaveBeenCalledWith(mockUser);
                    expect(res).toEqual(mockUser);
                });
            });
        });
        describe('and user has already been created', () => {
            beforeEach(() => {
                mockRepository = {
                    find: () => [dbUser],
                };
                mockDb = {
                    manager: jasmine.createSpyObj('manager', ['save']),
                    getRepository: (...params) => {
                        return mockRepository;
                    },
                };
                mockConnection = new MockConnection(mockDb);
            }),
            it('should not save user to db', () => {
                userService = new UserService(mockConnection, hashService),
                userService.create(user).catch((error) => {
                    expect(mockDb.manager.save).not.toHaveBeenCalled();
                    expect(error).toEqual(new Error('Username already taken'));
                });
            });
        });
    });
});
