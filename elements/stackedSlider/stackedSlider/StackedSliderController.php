<?php

namespace stackedSlider\stackedSlider;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\WpWidgets;

class StackedSliderController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        if (!defined('VCV_WP_SS_CONTROLLER')) {
            $this->addFilter(
                'vcv:editor:variables',
                'getVariables'
            );
            $this->wpAddAction(
                'template_redirect',
                'checkPlugin'
            );
            // $this->addFilter(
            //     'vcv:ajaxForm:render:response', 
            //     'renderForm'
            // );

            $this->wpAddAction( 'wp_enqueue_scripts', 'include_react_files' );

            define('VCV_WP_SS_CONTROLLER', true);
        }
    }

    /**
     * @param $variables
     * @param $payload
     *
     * @return array
     */
    protected function getVariables($variables, $payload)
    {
        $var = new PostType();
        $post_types = $var->getPostTypes();
        

        $posts = get_posts('post_type=post&numberposts=3');

        array_push($post_types, ['value' => 'images', 'label' => 'Images']);

        $variables[] = [
            'key' => 'vcvWpStackedSlider',
            'value' => $post_types,
        ];

        // error_log(print_r($payload, true));
        // error_log($variables['$postType']);
        return $variables;
    }

    protected function checkPlugin()
    {
        // if (!defined('WPCF7_VERSION')) {
            add_shortcode(
                'stackedSlider',
                function () {
                    return __('Plugin is not activated', 'vcwb');
                }
            );
        // }
    }

    protected function renderForm($response, $payload, WpWidgets $widgets)
    {
        // error_log(print_r($response, true));
        // error_log(print_r($payload, true));
        // error_log(print_r($widgets, true));
        if ($payload['action'] === 'vcv:stackedSlider:form') {
            $element = $payload['element'];
            $postType = $element['sourceType'];

            // $posts = get_posts('post_type='.$postType.'&numberposts=3');

            $this->getVariables(['$postType' => $postType], $payload);

            // $variables[] = [
            //     'key' => 'vcvWpStackedSliderSource',
            //     'value' => $posts,
            // ];

            // $response['html'] = $posts;
        }
        return $response;
    }

    function include_react_files() {
        // wp_enqueue_style( 'prefix-style', plugins_url('css/main.ae114d0c.css', __FILE__) );

        // add the JS file to the footer - true as the last parameter
        wp_register_script( 'plugin-scripts', plugins_url('../public/dist/element.bundle.js',
         __FILE__),array(),  '26.0', true );
        $data = array( 
                'key1' => 'value1',
                'key2' => 'value2'
            );

        wp_localize_script( 'plugin-scripts', 'object', $data );
        wp_enqueue_script( 'plugin-scripts' );
    }

}
