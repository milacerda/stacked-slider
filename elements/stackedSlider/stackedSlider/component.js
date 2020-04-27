import React from 'react'
import { getService } from 'vc-cake'
import classNames from 'classnames'

const vcvAPI = getService('api')

export default class StackedSlider extends vcvAPI.elementComponent {
  imageSources = []
  imageOrder = {}
  source = [];

  constructor (props) {
    super(props)
    this.state = { data: {} };
    this.createCustomSizeImage = this.createCustomSizeImage.bind(this)
  }

  componentDidMount () {
    this.imageSources = []
    this.imageOrder = {}
    this.prepareImage(this.props.atts.image)
    this.fetchPostData(this.props.atts.sourceType, this.props.atts.slides);
  }

  componentDidUpdate(prevProps) {
    if (this.props.atts.sourceType !== prevProps.atts.sourceType) {
      if (this.props.atts.sourceType !== 'images') {
        this.fetchPostData(this.props.atts.sourceType, this.props.atts.slides);
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    this.imageSources = []
    this.imageOrder = {}
    this.prepareImage(nextProps.atts.image)
  }

  prepareImage (image) {
    if (image.length && typeof image[0] === 'object') {
      let newImages = []
      image.forEach((item, index) => {
        let newItem = item
        newItem.full = newItem.id ? newItem.full : this.getImageUrl(newItem.full)
        newItem.id = newItem.id ? newItem.id : Math.random()
        newImages.push(item)
      })
      image = newImages
      this.setImageOrder(image)
      this.resizeImage(image)
    }
    let imgArr = []
    image.forEach((img) => {
      if (image && image.id) {
        imgArr.push({ imgSrc: this.getImageUrl(img) })
      } else {
        imgArr.push({ imgSrc: this.getImageUrl(img) })
      }
    })
    this.setImgSrcState(imgArr)
  }

  setImageOrder (imageArray) {
    imageArray.forEach((image, index) => {
      this.imageOrder[index] = image.id
    })
  }

  checkImageSize (image, callback, imgCount) {
    let img = new window.Image()
    img.onload = () => {
      let size = {
        width: img.width,
        height: img.height
      }
      callback(image, size, imgCount)
    }
    img.src = image.full
  }

  resizeImage (imageArray) {
    imageArray.forEach((image) => {
      this.checkImageSize(image, this.createCustomSizeImage, imageArray.length)
    })
  }

  createCustomSizeImage (image, size, imgCount) {
    image.orientation = this.checkOrientation(size)
    let checkImg = this.imageSources.filter((obj) => {
      return obj.id === image.id
    })
    if (!checkImg.length) {
      this.imageSources.push(image)
    }

    if (this.imageSources.length === imgCount) {
      this.orderImages()
    }
  }

  orderImages () {
    let imagesInOrder = []
    this.imageSources.forEach((img, index) => {
      let imgObj = this.imageSources.filter((obj) => {
        return obj.id === this.imageOrder[index]
      })
      if (imgObj[0]) {
        imagesInOrder.push({
          imgSrc: this.getImageUrl(imgObj[0], 'large'),
          orientation: imgObj[0].orientation,
          originalSrc: this.getImageUrl(imgObj[0]),
          alt: imgObj[0].alt,
          title: imgObj[0].title
        })
      }
    })

    this.setImgSrcState(imagesInOrder)
  }

  checkOrientation (size) {
    return size.width >= size.height ? 'landscape' : 'portrait'
  }

  setImgSrcState (imgSrc) {
    this.setState({ imgSrc })
  }

  fetchPostData(type = 'post', slides = 3) {

    if (type !== 'images') {
      fetch(`${window.wpApiSettings.root}wp/v2/${type}s?per_page=${slides}&_embed`)
        .then(response => response.json())
        .then(myJSON => {
          let newState = this.state;
          this.source = myJSON
          this.setState(newState);
        });
    }
  }

  render () {
    const { id, atts, editor } = this.props
    const { image, shape, clickableOptions, showCaption, customClass, metaCustomId, sourceType } = atts
    let containerClasses = [ 'vce-stacked-slider' ]
    let wrapperClasses = [ 'vce', 'vce-stacked-slider-wrapper' ]
    let containerProps = {}
    let arrowClasses = [ 'arrows' ]
    let CustomTag = 'div'
    let imgSrc;

    if (sourceType === 'images') {
      imgSrc = this.state && this.state.imgSrc
    } else {
      imgSrc = this.source.map((s) => {
        return { 
          imgSrc: s._embedded['wp:featuredmedia']['0'].source_url, 
          link: s.link,
          title: s.title.rendered
        }
      })
    }

    if (typeof customClass === 'string' && customClass) {
      containerClasses.push(customClass)
    }

    let mixinData = this.getMixinData('arrowColor')
    if (mixinData) {
      arrowClasses.push(`arrows-color--${mixinData.selector}`)
    }
  
    mixinData = this.getMixinData('arrowColorHover')
    if (mixinData) {
      arrowClasses.push(`arrows-color-hover--${mixinData.selector}`)
    }

    mixinData = this.getMixinData('imageOverlay')
    if (mixinData) {
      arrowClasses.push(`arrows-color--${mixinData.selector}`)
    }

    if (shape === 'rounded') {
      containerClasses.push('vce-image-gallery-with-zoom--border-rounded')
    }

    if (shape === 'round') {
      containerClasses.push('vce-image-gallery-with-zoom--border-round')
    }

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    let galleryItems = []

    imgSrc && imgSrc.forEach((src, index) => {
      let customProps = {}
      let classes = [ 'vce-stacked-slider-item-inner' ]
      let imgClasses = ['vce-stacked-slider-img']
      let itemProps = {}

      if (sourceType === 'images') {
        if (clickableOptions === 'url' && image[index].link && image[index].link.url) {
          CustomTag = 'a'
          let { url, title, targetBlank, relNofollow } = image[index].link
          customProps = {
            'href': url,
            'title': title,
            'target': targetBlank ? '_blank' : undefined,
            'rel': relNofollow ? 'nofollow' : undefined
          }
        } else if (clickableOptions === 'imageNewTab') {
          CustomTag = 'a'
          customProps = {
            'href': src.originalSrc || src.imgSrc,
            'target': '_blank'
          }
        } else if (clickableOptions === 'lightbox') {
          CustomTag = 'a'
          customProps = {
            'href': src.originalSrc || src.imgSrc,
            'data-lightbox': `lightbox-${id}`
          }
        } else if (clickableOptions === 'photoswipe') {
          CustomTag = 'a'
          customProps = {
            'href': src.originalSrc || src.imgSrc,
            'data-photoswipe-image': id,
            'data-photoswipe-index': index
          }
          if (showCaption) {
            customProps['data-photoswipe-caption'] = image[index].caption
          }
          containerProps['data-photoswipe-gallery'] = id
          itemProps['data-photoswipe-item'] = `photoswipe-${id}`
        }
      } else {
        CustomTag = 'a'
        customProps = {
          'href': src.link,
          'rel': 'nofollow'
        }
      }

      classes = classNames(classes)

      let itemClasses = [ 'vce-stacked-slider-item' ]

      itemClasses = classNames(itemClasses)

      let mixinDataOverlay = this.getMixinData('imageOverlay')
      if (mixinDataOverlay) {
        imgClasses.push(`vce-stacked-slider-item--overlay-${mixinDataOverlay.selector}`)
      }

      let mixinDataHover = this.getMixinData('imageOverlayHover')
      if (mixinDataHover) {
        imgClasses.push(`vce-stacked-slider-img--overlay-hover-${mixinDataHover.selector}`)
      } 
      if (mixinDataOverlay && !mixinDataHover) {
        imgClasses.push(`vce-stacked-slider-img--overlay-hover`)
      }

      imgClasses = classNames(imgClasses)

      let divStyle = {
        backgroundImage: `url(${src.imgSrc})`
      };

      let innerContent;
      
      if (sourceType === 'images') {
        innerContent = <CustomTag {...customProps} class='vce-stacked-slider-link'></CustomTag>;
      } else {
        innerContent = <CustomTag {...customProps} class='vce-stacked-slider-link'>
          <span class='vce-stacked-slider-title'>{src.title}</span>
        </CustomTag>;
      }

      galleryItems.push(
        <div className={itemClasses}>
          <div style={divStyle} className={imgClasses}
            key={`vce-stacked-slider-item-${index}-${id}`}
            {...itemProps}>
              {innerContent}
          </div>
        </div>
        
      );
    })

    const doAll = this.applyDO('all')
    containerClasses = classNames(containerClasses)
    wrapperClasses = classNames(wrapperClasses)
    arrowClasses = classNames(arrowClasses)
    
    let listClasses = [`mb-${galleryItems.length}`]
    listClasses.push('vce-stacked-slider-list')
    listClasses = classNames(listClasses)

    return (
      <div className={containerClasses} {...editor} {...containerProps}>
        <div className={wrapperClasses} id={'el-' + id} {...doAll}>
          <div className={listClasses}>
            {galleryItems}
          </div>
          <div className={arrowClasses}>
            <i id="prev" class="fas fa-arrow-left"></i>
            <i id="next" class="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
    )

  }
}