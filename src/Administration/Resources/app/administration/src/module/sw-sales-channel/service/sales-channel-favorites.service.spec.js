/**
 * @package sales-channel
 */

import SalesChannelFavoritesService from 'src/module/sw-sales-channel/service/sales-channel-favorites.service';

const responses = global.repositoryFactoryMock.responses;

responses.addResponse({
    method: 'Post',
    url: '/search/user-config',
    status: 200,
    response: {
        data: [{
            id: '8badf7ebe678ab968fe88c269c214ea6',
            userId: '8fe88c269c214ea68badf7ebe678ab96',
            key: SalesChannelFavoritesService.USER_CONFIG_KEY,
            value: []
        }]
    }
});

responses.addResponse({
    method: 'Post',
    url: '/user-config',
    status: 200,
    response: {
        data: []
    }
});

describe('module/sw-sales-channel/service/sales-channel-favorites.service.spec.js', () => {
    let service;

    beforeEach(async () => {
        Shopware.State.get('session').currentUser = {
            id: '8fe88c269c214ea68badf7ebe678ab96'
        };

        service = new SalesChannelFavoritesService();
    });

    it('getFavoriteIds > should return favorites from internal state', async () => {
        const expected = ['foo', 'bar'];
        service.state.favorites = expected;

        expect(service.getFavoriteIds()).toEqual(expected);
    });

    it('isFavorite > checks if given string is included in favorites', async () => {
        const expected = 'bar';
        service.state.favorites = ['foo', 'bar'];

        expect(service.isFavorite(expected)).toBeTruthy();
    });

    it('update > pushes new item to favorites and calls "saveUserConfig"', async () => {
        const newItem = 'biz';

        service.saveUserConfig = jest.fn();
        service.state.favorites = ['foo', 'bar'];

        service.update(true, newItem);

        expect(service.isFavorite(newItem)).toBeTruthy();
        expect(service.saveUserConfig).toBeCalled();
    });

    it('update > removes existing item from favorites and calls "saveUserConfig"', async () => {
        const removedItem = 'bar';

        service.saveUserConfig = jest.fn();
        service.state.favorites = ['foo', 'bar'];

        service.update(false, removedItem);

        expect(service.isFavorite(removedItem)).toBeFalsy();
        expect(service.saveUserConfig).toBeCalled();
    });

    it('update > does not add or remove items with a wrong state', async () => {
        const existingItem = 'foo';
        const nonExistingItem = 'biz';

        service.state.favorites = ['foo', 'bar'];

        service.update(false, nonExistingItem);
        expect(service.isFavorite(nonExistingItem)).toBeFalsy();

        service.update(true, existingItem);
        expect(service.isFavorite(existingItem)).toBeTruthy();
    });

    it('createUserConfigEntity > entity has specific values', async () => {
        const expectedValues = {
            userId: Shopware.State.get('session').currentUser.id,
            key: SalesChannelFavoritesService.USER_CONFIG_KEY,
            value: []
        };

        const entity = service.createUserConfigEntity(SalesChannelFavoritesService.USER_CONFIG_KEY);

        expect(entity).toMatchObject(expectedValues);
    });

    it('handleEmptyUserConfig > replaces the property "value" with an empty array', async () => {
        const userConfigMock = {
            value: {}
        };

        service.handleEmptyUserConfig(userConfigMock);

        expect(Array.isArray(userConfigMock.value)).toBeTruthy();
    });

    it('getCriteria > returns a criteria including specific filters', () => {
        const criteria = service.getCriteria(SalesChannelFavoritesService.USER_CONFIG_KEY);

        expect(criteria.filters).toContainEqual({ type: 'equals', field: 'key', value: SalesChannelFavoritesService.USER_CONFIG_KEY });
        expect(criteria.filters).toContainEqual({ type: 'equals', field: 'userId', value: '8fe88c269c214ea68badf7ebe678ab96' });
    });

    it('getCurrentUserId > returns the userId of the current session user', async () => {
        expect(service.getCurrentUserId()).toEqual('8fe88c269c214ea68badf7ebe678ab96');
    });
});
