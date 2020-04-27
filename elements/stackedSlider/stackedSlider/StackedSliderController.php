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

        return $variables;
    }

    protected function checkPlugin()
    {

        add_shortcode(
            'stackedSlider',
            function () {
                return __('Plugin is not activated', 'vcwb');
            }
        );

    }

    protected function renderForm($response, $payload, WpWidgets $widgets)
    {
        if ($payload['action'] === 'vcv:stackedSlider:form') {
            $element = $payload['element'];
            $postType = $element['sourceType'];

            $this->getVariables(['$postType' => $postType], $payload);
        }
        return $response;
    }

}
