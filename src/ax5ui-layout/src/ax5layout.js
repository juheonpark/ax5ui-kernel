/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.layout
(function (root, _SUPER_) {

    /**
     * @class ax5.ui.layout
     * @classdesc
     * @version 0.1.0
     * @author tom@axisj.com
     * @example
     * ```
     * var myLayout = new ax5.ui.layout();
     * ```
     */
    var U = ax5.util;

    //== UI Class
    var axClass = function () {
        var
            self = this,
            cfg;

        if (_SUPER_) _SUPER_.call(this); // 부모호출

        this.queue = [];
        this.config = {
            clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
            theme: 'default',
            animateTime: 250
        };

        this.openTimer = null;
        this.closeTimer = null;
        this.selectedIndex = 0;

        cfg = this.config;

        var
            onStateChanged = function (opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                }
                else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }
                return true;
            };
        /// private end

        /**
         * Preferences of layout UI
         * @method ax5.ui.layout.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.layout}
         * @example
         * ```
         * ```
         */
        this.init = function () {
            this.onStateChanged = cfg.onStateChanged;
            this.onClick = cfg.onClick;
            jQuery(window).bind("resize.ax5layout-" + this.instanceId, (function () {
                //alignLayout.call(this);
            }).bind(this));
        };

        /**
         * ax5.ui.layout.bind
         * @param {Object} item
         * @param {String} [item.control]
         * @param {String} [item.theme]
         * @param {Element} item.target
         * @param {Object[]} item.options
         * @returns {ax5.ui.layout}
         */
        this.bind = function (item) {
            var
                selectConfig = {},
                queIdx;

            item = jQuery.extend(true, selectConfig, cfg, item);
            if (!item.target) {
                console.log(ax5.info.getError("ax5layout", "401", "bind"));
                return this;
            }

            item.$target = jQuery(item.target);

            if (!item.id) item.id = item.$target.data("data-ax5layout-id");
            if (!item.id) {
                item.id = 'ax5layout-' + ax5.getGuid();
                item.$target.data("data-ax5layout-id", item.id);
            }
            item.name = item.$target.attr("data-ax5layout");
            if (item.options) {
                item.options = JSON.parse(JSON.stringify(item.options));
            }

            // target attribute data
            (function (data) {
                if (U.isObject(data) && !data.error) {
                    item = jQuery.extend(true, item, data);
                }
            })(U.parseJson(item.$target.attr("data-ax5layout-config"), true));

            queIdx = U.search(this.queue, function () {
                return this.id == item.id;
            });

            if (queIdx === -1) {
                this.queue.push(item);
                bindSelectTarget.call(this, this.queue.length - 1);
            }
            else {
                this.queue[queIdx] = jQuery.extend(true, {}, this.queue[queIdx], item);
                bindSelectTarget.call(this, queIdx);
            }

            selectConfig = null;
            queIdx = null;
            return this;
        };

        // 클래스 생성자
        this.main = (function () {
            if (arguments && U.isObject(arguments[0])) {
                this.setConfig(arguments[0]);
            }
            else {
                this.init();
            }
        }).apply(this, arguments);
    };
    //== UI Class

    root.layout = (function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    })(); // ax5.ui에 연결

})(ax5.ui, ax5.ui.root);

ax5.ui.layout_instance = new ax5.ui.layout();
jQuery.fn.ax5layout = (function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "...":
                    return ax5.ui.layout_instance.open(this);
                    break;

                default:
                    return this;
            }
        }
        else {
            if (typeof config == "undefined") config = {};
            jQuery.each(this, function () {
                var defaultConfig = {
                    target: this
                };
                config = jQuery.extend({}, config, defaultConfig);
                ax5.ui.layout_instance.bind(config);
            });
        }
        return this;
    }
})();