odoo.define('fixed_header_status.fix_header_status', function (require) {
"use strict";

    var FormView = require('web.FormView');

    FormView.include({
        load_form: function(data) {
            var self = this;
            if (!data) {
                throw new Error(_t("No data provided."));
            }
            if (this.arch) {
                throw "Form view does not support multiple calls to load_form";
            }
            this.fields_order = [];
            this.fields_view = data;

            this.rendering_engine.set_fields_registry(this.fields_registry);
            this.rendering_engine.set_tags_registry(this.tags_registry);
            this.rendering_engine.set_widgets_registry(this.widgets_registry);
            this.rendering_engine.set_fields_view(data);
            var $dest = this.$el.hasClass("oe_form_container") ? this.$el : this.$el.find('.oe_form_container');
            this.rendering_engine.render_to($dest);
            this.fix_statusbar();
            this.$el.on('mousedown.formBlur', function () {
                self.__clicked_inside = true;
            });

            this.has_been_loaded.resolve();

            // Add bounce effect on button 'Edit' when click on readonly page view.
            this.$el.find(".oe_form_group_row,.oe_form_field,label,h1,.oe_title,.oe_notebook_page, .oe_list_content").on('click', function (e) {
                if(self.get("actual_mode") == "view" && self.$buttons && !$(e.target).is('[data-toggle]')) {
                    var $button = self.$buttons.find(".oe_form_button_edit");
                    $button.openerpBounce();
                    e.stopPropagation();
                    core.bus.trigger('click', e);
                }
            });
            //bounce effect on red button when click on statusbar.
            this.$el.find(".oe_form_field_status:not(.oe_form_status_clickable)").on('click', function (e) {
                if((self.get("actual_mode") == "view")) {
                    var $button = self.$el.find(".oe_highlight:not(.o_form_invisible)").css({'float':'left','clear':'none'});
                    $button.openerpBounce();
                    e.stopPropagation();
                }
             });
            this.trigger('form_view_loaded', data);
            $('.oe_application > .oe_view_manager_current').addClass('ok-hidden');
            return $.when();
        },
        fix_statusbar: function () {
            var container = this.rendering_engine.view.$el.find('.oe_form_container');
            var header = container.find('header.o_statusbar_buttons');

            if (header.length > 0){
                container.find('.oe_form').before(header);
                container.addClass('npp_container');
                container.find('.oe_form').addClass('of_auto');
            }
//            else{
//                $('.oe_application > .oe-view-manager.oe_view_manager_current').removeClass('ok-hidden');
//            }
            $('.oe_form_status').addClass('right');
        }
    });
});