/**
 * @package content
 */
import { shallowMount } from '@vue/test-utils';
import swCategoryLinkSettings from 'src/module/sw-category/component/sw-category-link-settings';

Shopware.Component.register('sw-category-link-settings', swCategoryLinkSettings);

async function createWrapper(category = {}) {
    const responses = global.repositoryFactoryMock.responses;

    responses.addResponse({
        method: 'Post',
        url: '/search/category',
        status: 200,
        response: {
            data: [
                {
                    id: Shopware.Utils.createId(),
                    attributes: {
                        id: Shopware.Utils.createId()
                    },
                    relationships: [],
                }
            ]
        }
    });

    return shallowMount(await Shopware.Component.build('sw-category-link-settings'), {
        stubs: {
            'sw-card': true,
            'sw-text-field': true,
            'sw-single-select': true,
            'sw-entity-single-select': true,
            'sw-switch-field': true,
            'sw-category-tree-field': true
        },
        propsData: {
            category
        }
    });
}

describe('src/module/sw-category/component/sw-category-link-settings', () => {
    beforeEach(() => {
        global.activeAclRoles = [];
    });

    it('should be a Vue.js component', async () => {
        const wrapper = await createWrapper();

        expect(wrapper.vm).toBeTruthy();
    });

    it('should have an enabled text field for old configuration', async () => {
        global.activeAclRoles = ['category.editor'];
        const wrapper = await createWrapper({
            linkType: null,
            externalLink: 'https://'
        });

        const linkTypeField = wrapper.find('sw-single-select-stub');
        expect(linkTypeField.attributes().disabled).toBeFalsy();
        expect(linkTypeField.attributes().options).toBeTruthy();
        expect(wrapper.vm.linkTypeValues).toHaveLength(2);

        const textField = wrapper.find('sw-text-field-stub');
        expect(textField.attributes().disabled).toBeFalsy();

        const newTabField = wrapper.find('sw-switch-field-stub');
        expect(newTabField.attributes().disabled).toBeFalsy();
    });

    it('should have an enabled text field for external link', async () => {
        global.activeAclRoles = ['category.editor'];

        const wrapper = await createWrapper({
            linkType: 'external'
        });

        const linkTypeField = wrapper.find('sw-single-select-stub');
        expect(linkTypeField.attributes().disabled).toBeFalsy();
        expect(linkTypeField.attributes().options).toBeTruthy();
        expect(wrapper.vm.linkTypeValues).toHaveLength(2);

        const textField = wrapper.find('sw-text-field-stub');
        expect(textField.attributes().disabled).toBeFalsy();

        const newTabField = wrapper.find('sw-switch-field-stub');
        expect(newTabField.attributes().disabled).toBeFalsy();
    });

    it('should have enabled select fields for internal link', async () => {
        global.activeAclRoles = ['category.editor'];

        const wrapper = await createWrapper({
            linkType: 'product'
        });

        const selects = wrapper.findAll('sw-single-select-stub');
        expect(selects).toHaveLength(2);

        const linkTypeField = selects.at(0);
        expect(linkTypeField.attributes().disabled).toBeFalsy();
        expect(linkTypeField.attributes().options).toBeTruthy();
        expect(wrapper.vm.linkTypeValues).toHaveLength(2);

        const internalTypeField = selects.at(1);
        expect(internalTypeField.attributes().disabled).toBeFalsy();
        expect(internalTypeField.attributes().options).toBeTruthy();
        expect(wrapper.vm.entityValues).toHaveLength(3);

        const productSelectField = wrapper.find('sw-entity-single-select-stub');
        expect(productSelectField.attributes().disabled).toBeFalsy();
        expect(productSelectField.attributes().entity).toEqual('product');

        const newTabField = wrapper.find('sw-switch-field-stub');
        expect(newTabField.attributes().disabled).toBeFalsy();
    });

    it('should have correct select fields on entity switch', async () => {
        global.activeAclRoles = ['category.editor'];

        const wrapper = await createWrapper({
            linkType: 'product',
            internalLink: 'someUuid'
        });

        const productSelectField = wrapper.find('sw-entity-single-select-stub');
        expect(productSelectField.attributes().entity).toEqual('product');
        expect(wrapper.vm.category.internalLink).toBe('someUuid');
    });

    it('should clean up on switch to internal', async () => {
        global.activeAclRoles = ['category.editor'];

        const wrapper = await createWrapper({
            linkType: 'external',
            externalLink: 'https://'
        });

        await wrapper.setData({
            mainType: 'internal'
        });
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.category.externalLink).toBeNull();
    });

    it('should clean up on switch to external', async () => {
        global.activeAclRoles = ['category.editor'];

        const wrapper = await createWrapper({
            linkType: 'internal',
            internalLink: 'someUuid'
        });

        await wrapper.setData({
            mainType: 'external'
        });

        expect(wrapper.vm.category.internalLink).toBeNull();
    });

    it('should have disabled fields with no rights', async () => {
        const wrapper = await createWrapper({
            linkType: 'external'
        });

        const linkTypeField = wrapper.find('sw-single-select-stub');
        expect(linkTypeField.attributes().disabled).toBeTruthy();

        const externalLinkField = wrapper.find('sw-text-field-stub');
        expect(externalLinkField.attributes().disabled).toBeTruthy();

        const newTabField = wrapper.find('sw-switch-field-stub');
        expect(newTabField.attributes().disabled).toBeTruthy();
    });

    it('should show only categories with type page', async () => {
        global.activeAclRoles = ['category.editor'];

        const wrapper = await createWrapper({
            linkType: 'category',
            internalLink: 'someUuid'
        });

        wrapper.find('sw-category-tree-field-stub');
        const criteria = wrapper.vm.categoryCriteria;
        const expectedFilters = [{ type: 'equals', field: 'type', value: 'page' }];

        expect(criteria.filters).toEqual(expect.arrayContaining(expectedFilters));
    });

    it('should have correct internal link', async () => {
        global.activeAclRoles = ['category.editor'];

        const wrapper = await createWrapper({
            linkType: 'category',
            internalLink: 'someUuid'
        });

        wrapper.find('sw-category-tree-field-stub');
        expect(wrapper.vm.category.internalLink).toBe('someUuid');
    });
});
