/**
 * @package system-settings
 */
import { shallowMount, createLocalVue } from '@vue/test-utils';
import 'src/module/sw-settings-shopware-updates/page/sw-settings-shopware-updates-wizard';
import 'src/app/component/structure/sw-page';
import 'src/module/sw-settings-shopware-updates/view/sw-settings-shopware-updates-requirements';
import 'src/app/component/base/sw-card';
import 'src/app/component/form/sw-checkbox-field';
import 'src/app/component/structure/sw-card-view';
import 'src/app/component/data-grid/sw-data-grid';
import 'src/app/component/base/sw-button';
import 'src/app/component/utils/sw-color-badge';

describe('module/sw-settings-shopware-updates/page/sw-settings-shopware-updates-wizard', () => {
    let wrapper;
    const localVue = createLocalVue();

    beforeEach(async () => {
        Shopware.Application.view.deleteReactive = () => {};
        wrapper = shallowMount(await Shopware.Component.build('sw-settings-shopware-updates-wizard'), {
            localVue,
            provide: {
                updateService: {
                    checkForUpdates: () => Promise.resolve({
                        extensions: [],
                        title: 'Release 6.4.18.0',
                        body: 'This is a test release',
                        date: '2022-12-08T09:04:06.000+00:00',
                        version: '6.4.18.0',
                        fixedVulnerabilities: []
                    }),
                    checkRequirements: () => Promise.resolve([
                        {
                            name: 'writeableCheck',
                            result: true,
                            message: 'writeableCheckValid',
                            vars: {
                                checkedDirectories: ''
                            },
                            extensions: []
                        },
                        {
                            name: 'validShopwareLicense',
                            result: false,
                            message: 'validShopwareLicense',
                            vars: [],
                            extensions: []
                        }
                    ]),
                    deactivatePlugins: () => {
                        const error = new Error();

                        error.response = {
                            data: {
                                errors: [
                                    {
                                        code: 'THEME__THEME_ASSIGNMENT',
                                        meta: {
                                            parameters: {
                                                themeName: '7305fd18-09ee-4d2c-afd4-b9fb90ad8508',
                                                assignments: 'afe95e1e-cc8e-487b-863a-94c5c4e51fa6'
                                            }
                                        }
                                    }
                                ]
                            }
                        };

                        return Promise.reject(error);
                    },
                    extensionCompatibility: () => Promise.resolve([]),
                    downloadRecovery: () => Promise.resolve([]),
                }
            },
            mocks: {
                $route: {
                    name: '',
                    meta: {
                        parentPath: 'sw.settings.index',
                        $module: {
                            type: 'core',
                            name: 'settings',
                            title: 'sw-settings.general.mainMenuItemGeneral',
                            color: '#9AA8B5',
                            icon: 'default-action-settings',
                            favicon: 'icon-module-settings.png',
                            routes: {
                                index: {
                                    path: '/sw/settings/index',
                                    icon: 'default-action-settings',
                                    name: 'sw.settings.index',
                                    type: 'core',
                                    components: {
                                        default: {
                                            _custom: {
                                                type: 'function',
                                                display: '<span>ƒ</span> VueComponent(options)'
                                            }
                                        }
                                    },
                                    isChildren: false,
                                    routeKey: 'index'
                                }
                            },
                            navigation: [
                                {
                                    id: 'sw-settings',
                                    label: 'sw-settings.general.mainMenuItemGeneral',
                                    color: '#9AA8B5',
                                    icon: 'default-action-settings',
                                    path: 'sw.settings.index',
                                    position: 80,
                                    children: []
                                }
                            ]
                        }
                    },
                    params: {
                        id: ''
                    }
                },
                $i18n: {
                    locale: 'de-De'
                }
            },
            stubs: {
                'sw-page': await Shopware.Component.build('sw-page'),
                'sw-search-bar': {
                    template: '<div></div>'
                },
                'sw-notification-center': {
                    template: '<div></div>'
                },
                'sw-help-center': true,
                'sw-tooltip': {
                    template: '<div></div>'
                },
                'sw-settings-shopware-updates-requirements':
                    await Shopware.Component.build('sw-settings-shopware-updates-requirements'),
                'sw-data-grid': await Shopware.Component.build('sw-data-grid'),
                'sw-card-view': await Shopware.Component.build('sw-card-view'),
                'sw-card': await Shopware.Component.build('sw-card'),
                'sw-ignore-class': true,
                'sw-settings-shopware-updates-info': {
                    template: '<div></div>'
                },
                'sw-settings-shopware-updates-plugins': {
                    template: '<div></div>'
                },
                'sw-loader': {
                    template: '<div></div>'
                },
                'sw-icon': {
                    template: '<div></div>'
                },
                'router-link': {
                    template: '<a></a>'
                },
                'sw-button': await Shopware.Component.build('sw-button'),
                'sw-color-badge': await Shopware.Component.build('sw-color-badge'),
                'sw-app-actions': true,
                'sw-extension-component-section': true,
                'sw-error-summary': true,
                'sw-modal': {
                    template: '<div><slot name="modal-footer"></slot></div>'
                },
                'sw-progress-bar': true,
                'sw-checkbox-field': await Shopware.Component.build('sw-checkbox-field'),
                'sw-field-error': true,
                'sw-base-field': true,
            },
            attachTo: document.body,
        });
    });

    it('should be a Vue.JS component', async () => {
        expect(wrapper.vm).toBeTruthy();
    });

    it('should have three green color badges and one red one', async () => {
        const allGreenColorBadges = wrapper.findAll('.sw-color-badge.is--success');
        const allRedColorBadges = wrapper.findAll('.sw-color-badge.is--error');

        expect(allGreenColorBadges.length).toBe(1);
        expect(allRedColorBadges.length).toBe(1);
    });

    it('should disable the button if one requirement is not met', async () => {
        const button = wrapper.find('.smart-bar__actions .sw-button');

        expect(button.attributes('disabled')).toBe('disabled');
    });

    it('should show the correct error message, when theme deactivation fails', async () => {
        const stopUpdateProcessSpy = jest.spyOn(wrapper.vm, 'stopUpdateProcess');
        const createNotificationWarningSpy = jest.spyOn(wrapper.vm, 'createNotificationWarning');
        const translationSpy = jest.spyOn(wrapper.vm, '$tc');

        wrapper.vm.deactivatePlugins(0);
        await wrapper.vm.$nextTick();

        expect(stopUpdateProcessSpy).toHaveBeenCalled();
        expect(createNotificationWarningSpy).toHaveBeenCalled();
        expect(translationSpy).toHaveBeenCalledWith(
            'sw-extension.errors.messageDeactivationFailedThemeAssignment',
            null,
            null,
            {
                assignments: 'afe95e1e-cc8e-487b-863a-94c5c4e51fa6',
                themeName: '7305fd18-09ee-4d2c-afd4-b9fb90ad8508'
            }
        );
    });

    it('deactivate plugins success', async () => {
        wrapper.vm.updateService.deactivatePlugins = () => {
            return Promise.resolve({
                offset: 0,
                total: 0
            });
        };

        const redirectSpy = jest.fn();
        wrapper.vm.redirectToPage = redirectSpy;

        await wrapper.vm.deactivatePlugins(0);

        expect(redirectSpy).toHaveBeenCalledWith(`${Shopware.Context.api.basePath}/shopware-installer.phar.php`);
    });

    it('deactivate plugins success loops to disable all', async () => {
        wrapper.vm.updateService.deactivatePlugins = (offset) => {
            if (offset === 0) {
                return Promise.resolve({
                    offset: 1,
                    total: 2
                });
            }

            return Promise.resolve({
                offset: 1,
                total: 1
            });
        };

        const redirectSpy = jest.fn();
        wrapper.vm.redirectToPage = redirectSpy;

        const updateCallSpy = jest.spyOn(wrapper.vm.updateService, 'deactivatePlugins');

        await wrapper.vm.deactivatePlugins(0);
        await flushPromises();

        expect(redirectSpy).toHaveBeenCalledWith(`${Shopware.Context.api.basePath}/shopware-installer.phar.php`);
        expect(updateCallSpy).toHaveBeenCalledTimes(2);
    });

    it('download recovery should disable extensions', async () => {
        const disableExtensionsSpy = jest.spyOn(wrapper.vm, 'deactivatePlugins');

        await wrapper.vm.downloadRecovery();
        expect(wrapper.vm.progressbarValue).toBe(0);

        expect(disableExtensionsSpy).toHaveBeenCalled();
    });

    it('download recovery should on error notification', async () => {
        wrapper.vm.updateService.downloadRecovery = () => Promise.reject(new Error('error'));

        const createNotificationErrorSpy = jest.spyOn(wrapper.vm, 'createNotificationError');

        await wrapper.vm.downloadRecovery();
        await flushPromises();

        expect(wrapper.vm.progressbarValue).toBe(0);
        expect(createNotificationErrorSpy).toHaveBeenCalled();
    });

    it('start update should download recovery', async () => {
        const downloadRecoverySpy = jest.spyOn(wrapper.vm, 'downloadRecovery');

        await wrapper.vm.startUpdateProcess();
        expect(downloadRecoverySpy).toHaveBeenCalled();

        expect(wrapper.emitted('update-started')).toBeTruthy();
        expect(wrapper.emitted('update-started').length).toBe(1);
    });

    it('test changelog info are rendered', async () => {
        const element = await wrapper.get('div[changelog]');
        expect(element.attributes().changelog).toBe('This is a test release');
    });

    it('click on update button', async () => {
        wrapper.vm.updateService.deactivatePlugins = () => {
            return Promise.resolve({
                offset: 1,
                total: 1
            });
        };
        wrapper.vm.requirements = [];

        expect(wrapper.vm.updatePossible).toBe(true);
        expect(wrapper.vm.updaterIsRunning).toBe(false);
        expect(wrapper.vm.updateModalShown).toBe(false);

        await wrapper.vm.$nextTick();

        await wrapper.get('.sw-settings-shopware-updates-wizard__start-update').trigger('click');
        await flushPromises();

        expect(wrapper.vm.updateModalShown).toBe(true);

        expect(wrapper.find('.sw-settings-shopware-updates-check__start-update').exists()).toBe(true);

        await wrapper.get('.sw-settings-shopware-updates-check__start-update-backup-checkbox input').setChecked(true);

        await wrapper.get('.sw-settings-shopware-updates-check__start-update-button').trigger('click');

        const redirectSpy = jest.fn();
        wrapper.vm.redirectToPage = redirectSpy;

        expect(wrapper.emitted('update-started')).toBeTruthy();
        expect(wrapper.emitted('update-started').length).toBe(1);

        await flushPromises();

        expect(redirectSpy).toHaveBeenCalledWith(`${Shopware.Context.api.basePath}/shopware-installer.phar.php`);
    });
});
