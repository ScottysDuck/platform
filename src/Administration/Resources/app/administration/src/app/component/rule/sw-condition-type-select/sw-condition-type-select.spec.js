import { shallowMount } from '@vue/test-utils';
import 'src/app/component/rule/sw-condition-type-select';

async function createWrapper(customProps = {}, customOptions = {}) {
    return shallowMount(await Shopware.Component.build('sw-condition-type-select'), {
        stubs: {
            'sw-arrow-field': true,
            'sw-grouped-single-select': true
        },
        provide: {
            removeNodeFromTree: () => {
            },
            conditionDataProviderService: {},
            restrictedConditions: {},
        },
        propsData: {
            condition: {
                promotionAssociation: [
                    {
                        id: 'random-promotion-id'
                    }
                ]
            },
            availableTypes: [],
            ...customProps
        },
        ...customOptions
    });
}

describe('src/app/component/rule/sw-condition-type-select', () => {
    it('should be a Vue.JS component', async () => {
        const wrapper = await createWrapper();

        expect(wrapper.vm).toBeTruthy();
    });

    it('should have enabled fields', async () => {
        const wrapper = await createWrapper();

        const arrowField = wrapper.find('sw-arrow-field-stub');
        const singleSelect = wrapper.find('sw-grouped-single-select-stub');

        expect(arrowField.attributes().disabled).toBeUndefined();
        expect(singleSelect.attributes().disabled).toBeUndefined();
    });

    it('should have disabled fields', async () => {
        const wrapper = await createWrapper();
        await wrapper.setProps({
            disabled: true
        });

        const arrowField = wrapper.find('sw-arrow-field-stub');
        const singleSelect = wrapper.find('sw-grouped-single-select-stub');

        expect(arrowField.attributes().disabled).toBe('true');
        expect(singleSelect.attributes().disabled).toBe('true');
    });

    it('should have the right tooltip according to the restriction', async () => {
        const wrapper = await createWrapper({}, {
            provide: {
                removeNodeFromTree: () => {
                },
                conditionDataProviderService: {},
                restrictedConditions: {
                    customerBillingCountry: [
                        {
                            associationName: 'customerBillingCountry',
                            snippet: 'sw-customer-billing-country'
                        }
                    ]
                }
            },
        });

        let tooltipConfig = wrapper.vm.getTooltipConfig({
            component: 'sw-condition-billing-country',
            label: 'sw-billing-country-condition',
            scopes: ['checkout'],
            group: 'customer',
            type: 'customerBillingCountry',
        });
        expect(tooltipConfig.disabled).toBeFalsy();

        tooltipConfig = wrapper.vm.getTooltipConfig({
            component: 'sw-condition-email',
            label: 'sw-billing-country-condition',
            scopes: ['checkout'],
            group: 'customer',
            type: 'customerEmail',
        });
        expect(tooltipConfig.disabled).toBeTruthy();
    });

    it('should remove node from tree if condition has an child association field', async () => {
        const wrapper = await createWrapper({}, {
            provide: {
                removeNodeFromTree: jest.fn(),
                conditionDataProviderService: {},
                restrictedConditions: {},
            }
        });

        // mocking childAssociationField
        wrapper.vm.childAssociationField = 'promotionAssociation';

        await wrapper.vm.changeType('customer');

        expect(wrapper.vm.removeNodeFromTree).toHaveBeenCalledTimes(1);
    });

    it('should get groupAssignments with flow triggers', async () => {
        const wrapper = await createWrapper({}, {
            provide: {
                removeNodeFromTree: () => {
                },
                conditionDataProviderService: {},
                restrictedConditions: {
                    someRestriction: [
                        {
                            associationName: 'flowTrigger.testingFlow'
                        }
                    ]
                }
            },
        });

        expect(wrapper.vm.groupAssignments({
            type: 'someRestriction'
        })).toEqual(' sw-restricted-rules.restrictedConditions.relation.flowTrigger');
    });

    it('should get groupAssignments with promotions', async () => {
        const wrapper = await createWrapper({}, {
            provide: {
                removeNodeFromTree: () => {
                },
                conditionDataProviderService: {},
                restrictedConditions: {
                    someRestriction: [
                        {
                            associationName: 'promotion'
                        },
                        {
                            associationName: 'flowTrigger.someFlow'
                        },
                        {
                            associationName: 'flowTrigger.anotherFlow'
                        },
                        {
                            associationName: 'flowTrigger.moreFlows'
                        },
                    ]
                }
            },
        });

        expect(wrapper.vm.groupAssignments({
            type: 'someRestriction'
        })).toEqual(' sw-restricted-rules.restrictedConditions.relation.promotion </br> sw-restricted-rules.restrictedConditions.relation.flowTrigger<br />sw-restricted-rules.restrictedConditions.relation.flowTrigger<br />sw-restricted-rules.restrictedConditions.relation.flowTrigger');
    });
});
