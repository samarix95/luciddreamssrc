import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { colourToRgbObj, getEffectiveRadius, calculateBounds, produceRgbShades } from './utils.js';
import hexStrings from './hexStrings.js';

const fullCircle = 2 * Math.PI;
const quarterCircle = fullCircle / 4;

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function hexToRgb(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
    }
    throw new Error('Bad Hex');
}

class ColourWheel extends Component {
    constructor() {
        super()

        this.state = {
            rgb: null,
            innerWheelOpen: false,
            centerCircleOpen: false
        }

        // Initialised just before the DOM has loaded; after constructor().
        this.outerWheelBounds = null
        this.innerWheelBounds = null
        this.centerCircleBounds = null

        this.outerWheelRadius = null
        this.innerWheelRadius = null
        this.centerCircleRadius = null
        this.firstSpacerRadius = null
        this.secondSpacerRadius = null

        // Initialised once the DOM has loaded.
        this.canvasEl = null
        this.ctx = null

        // Bindings:
        this.onCanvasHover = this.onCanvasHover.bind(this)
        this.onCanvasClick = this.onCanvasClick.bind(this)
    }

    // MARK - Common:
    getRelativeMousePos(clientX, clientY) {
        const { radius } = this.props

        const canvasPos = this.canvasEl.getBoundingClientRect()
        const h = radius * 2
        const w = radius * 2

        // evtPos relative to our canvas.
        const onCanvas = {
            x: clientX - canvasPos.left,
            y: clientY - canvasPos.top
        }

        // e is our mouse-position relative to the center of the canvasEl; using pythag
        const fromCenter = Math.sqrt((onCanvas.x - (w / 2)) * (onCanvas.x - (w / 2)) + (onCanvas.y - (h / 2)) * (onCanvas.y - (h / 2)))

        // This returns an object in which we have both mouse-pos relative to the canvas, as well as the true-middle.
        return {
            fromCenter,
            onCanvas
        }
    }

    initCanvas() {
        const { radius } = this.props

        const width = radius * 2
        const height = radius * 2

        this.ctx.clearRect(0, 0, width, height)

        this.drawOuterWheel()
        this.drawSpacers()
    }

    // MARK - Life-cycle methods:
    componentWillMount() {
        const { radius, lineWidth, padding } = this.props

        // Setting effective radii:
        this.outerWheelRadius = radius
        this.innerWheelRadius = this.outerWheelRadius - lineWidth - padding
        this.centerCircleRadius = this.innerWheelRadius - lineWidth - padding
        this.firstSpacerRadius = this.outerWheelRadius - lineWidth // NOTE: effectiveRadius will take into account padding as lineWidth.
        this.secondSpacerRadius = this.innerWheelRadius - lineWidth

        // Defining our bounds-objects, exposes a .inside(e) -> boolean method:
        this.outerWheelBounds = calculateBounds(radius - lineWidth, radius)
        this.innerWheelBounds = calculateBounds(this.innerWheelRadius - lineWidth, this.innerWheelRadius)
        this.centerCircleBounds = calculateBounds(0, this.centerCircleRadius)
        this.firstSpacerBounds = calculateBounds(this.firstSpacerRadius - padding, this.firstSpacerRadius)
        this.secondSpacerBounds = calculateBounds(this.secondSpacerRadius - padding, this.secondSpacerRadius)
    }

    componentDidMount() {
        // Giving this context to our parent component.
        this.props.onRef(this)

        // Initialising our canvas & context objs.
        this.canvasEl = document.getElementById('colour-picker')
        this.ctx = this.canvasEl.getContext('2d')

        if (this.props.preset) {
            const rgb = colourToRgbObj(this.props.presetColour)
            this.setState({ rgb }, () => {
                this.drawOuterWheel()
                this.drawInnerWheel()
                this.drawCenterCircle()
                this.drawSpacers()
            })
        } else {
            this.drawOuterWheel()
            this.drawSpacers()
        }
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    // MARK - mouse-events:
    onCanvasHover({ clientX, clientY }) {
        const evt = this.getRelativeMousePos(clientX, clientY)

        // Cases for mouse-location:
        if (this.outerWheelBounds.inside(evt.fromCenter)) {
            this.canvasEl.style.cursor = 'crosshair'
        }
        else if (this.innerWheelBounds.inside(evt.fromCenter) && this.state.innerWheelOpen) {
            this.canvasEl.style.cursor = 'crosshair'
        }
        else if (this.centerCircleBounds.inside(evt.fromCenter) && this.state.centerCircleOpen) { // TODO: Have it clear on click?
            this.canvasEl.style.cursor = 'pointer'
        }
        else {
            this.canvasEl.style.cursor = 'auto'
        }
    }

    onCanvasClick({ clientX, clientY }) {
        const evt = this.getRelativeMousePos(clientX, clientY)

        // Cases for click-events:
        if (this.outerWheelBounds.inside(evt.fromCenter)) {
            this.outerWheelClicked(evt.onCanvas)
        }
        else if (this.innerWheelBounds.inside(evt.fromCenter)) {
            this.innerWheelClicked(evt.onCanvas)
        }
        else if (this.centerCircleBounds.inside(evt.fromCenter)) {
            this.onCenterCircleClick();
        }
    }

    // MARK - Clicks & action methods:
    outerWheelClicked(evtPos) {
        // returns an rgba array of the pixel-clicked.
        const rgbaArr = this.ctx.getImageData(evtPos.x, evtPos.y, 1, 1).data
        const [r, g, b] = rgbaArr

        const rgb = { r, g, b }

        this.setState({
            rgb,
            innerWheelOpen: true,
            centerCircleOpen: true
        }, () => {
            this.drawInnerWheel()
            this.drawCenterCircle()
        })
    }

    innerWheelClicked(evtPos) {
        const rgbaArr = this.ctx.getImageData(evtPos.x, evtPos.y, 1, 1).data
        const [r, g, b] = rgbaArr

        const rgb = { r, g, b }

        this.setState({ rgb, centerCircleOpen: true }, () => { this.drawCenterCircle() })
    }

    onCenterCircleClick() {
        const { rgb } = this.state;
        this.props.onCenterCircleClick("#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b));
    }

    setPresetColour(hex) {
        const rgb = colourToRgbObj(hexToRgb(hex));
        this.setState({ rgb }, () => {
            this.drawOuterWheel()
            this.drawInnerWheel()
            this.drawCenterCircle()
            this.drawSpacers()
        })
    }

    clear(callback = false) {
        this.setState({
            rgb: null,
            innerWheelOpen: false,
            centerCircleOpen: false
        }, () => {
            // Reset state & re-draw.
            this.initCanvas()
            if (callback) callback()
        })
    }

    // MARK - Drawing:
    drawOuterWheel() {
        // TODO: Draw outline; separate method.
        const { radius, colours, lineWidth } = this.props
        const height = radius * 2
        const width = radius * 2

        // This value ensures that the stroke accounts for the lineWidth provided to produce an accurately represented radius.
        const effectiveRadius = getEffectiveRadius(radius, lineWidth)

        // Converting each colour into a relative rgb-object we can iterate through.
        const rgbArr = colours.map(colour => colourToRgbObj(colour))

        rgbArr.forEach((rgb, i) => {
            this.ctx.beginPath()

            // Creates strokes 1 / rgbArr.length of the circle circumference.
            const startAngle = (fullCircle / rgbArr.length) * i
            const endAngle = (fullCircle / rgbArr.length) * (i + 1)

            this.ctx.arc(width / 2, height / 2, effectiveRadius, startAngle, endAngle)
            this.ctx.lineWidth = lineWidth // This is the width of the innerWheel.

            // Stroke-style changes based on the shade:
            this.ctx.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
            this.ctx.stroke()
            this.ctx.closePath()
        })
    }

    drawSpacers() {
        if (this.props.spacers) {
            this.drawSpacer(this.firstSpacerRadius)
            this.drawSpacer(this.secondSpacerRadius)
        }
    }

    drawSpacer(spacerRadius) {
        const { radius, padding, spacers: { colour, shadowColour, shadowBlur } } = this.props

        const height = radius * 2
        const width = radius * 2

        const effectiveRadius = getEffectiveRadius(spacerRadius, padding)

        this.ctx.beginPath()

        this.ctx.arc(width / 2, height / 2, effectiveRadius, 0, fullCircle)
        this.ctx.lineWidth = padding

        this.ctx.shadowColor = shadowColour
        this.ctx.shadowBlur = shadowBlur
        this.ctx.strokeStyle = colour
        this.ctx.stroke()
        this.ctx.closePath()

        // To reset our shadowColor for other strokes.
        this.ctx.shadowColor = 'transparent'
    }

    drawInnerWheel(animationPercentage = 0) {
        // raf setup.
        let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
        window.requestAnimationFrame = requestAnimationFrame

        const { rgb: { r, g, b } } = this.state
        const { radius, lineWidth, shades, animated } = this.props

        const height = radius * 2
        const width = radius * 2

        const effectiveRadius = getEffectiveRadius(this.innerWheelRadius, lineWidth)

        // Re-initialising canvas.
        this.ctx.clearRect(0, 0, width, height)

        this.drawOuterWheel()
        this.drawSpacers()

        const rgbShades = produceRgbShades(r, g, b, shades)

        // Different functions for drawing our inner-wheel of shades.
        function drawShades() {
            rgbShades.forEach((rgb, i) => {
                this.ctx.beginPath()

                const startAngle = ((fullCircle / rgbShades.length) * i) + quarterCircle
                const endAngle = ((fullCircle / rgbShades.length) * (i + 1)) + (1 / 2) * Math.PI

                this.ctx.arc(width / 2, height / 2, effectiveRadius, startAngle, endAngle)
                this.ctx.lineWidth = lineWidth // This is the width of the innerWheel.

                // Stroke style changes based on the shade:
                this.ctx.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
                this.ctx.stroke()
                this.ctx.closePath()
            })
        }

        function animateShades() {
            rgbShades.forEach((rgb, i) => {
                this.ctx.beginPath()

                const startAngle = ((fullCircle / rgbShades.length) * i) + quarterCircle
                const endAngle = ((fullCircle / rgbShades.length) * (i + 1)) + (1 / 2) * Math.PI

                this.ctx.arc(width / 2, height / 2, effectiveRadius, startAngle, endAngle)
                this.ctx.lineWidth = lineWidth * animationPercentage // This is the width of the innerWheel.

                // Stroke style changes based on the shade:
                this.ctx.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
                this.ctx.stroke()
                this.ctx.closePath()
            })

            // TODO: Make this animation speed dynamic.
            animationPercentage += (1 / 10) // i.e. 1 / x frames

            // Essentially re-draws rgbShades.forEach until the animationPercentage reaches 1, i.e. 100%
            if (animationPercentage < 1) requestAnimationFrame(animateShades)
        }

        animateShades = animateShades.bind(this)
        drawShades = drawShades.bind(this)

        if (animated) {
            animateShades()
        }
        else { // TODO: Refactor into its own func.
            drawShades()
        }
    }

    drawCenterCircle() {
        const { rgb } = this.state
        const { radius } = this.props

        const height = radius * 2
        const width = radius * 2
        this.ctx.lineWidth = 0

        this.ctx.beginPath()
        this.ctx.arc(width / 2, height / 2, this.centerCircleRadius, 0, 2 * Math.PI)
        this.ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
        this.ctx.fill()
        this.ctx.lineWidth = 0.1
        this.ctx.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
        this.ctx.stroke()
        this.ctx.closePath()

        this.ctx.beginPath();
        this.ctx.moveTo(radius - radius / 10, radius);
        this.ctx.lineTo(radius - radius / 10, radius);
        this.ctx.lineTo(radius, radius + radius / 12);
        this.ctx.lineTo(radius + radius / 10, radius - radius / 12);
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 5;
        this.ctx.stroke();
    }

    render() {
        const { radius, dynamicCursor } = this.props

        return (
            dynamicCursor ? (
                <canvas
                    id='colour-picker'
                    onClick={this.onCanvasClick}
                    onMouseMove={this.onCanvasHover}
                    width={`${radius * 2}px`}
                    height={`${radius * 2}px`}
                />
            ) : (
                    <canvas
                        id='colour-picker'
                        onClick={this.onCanvasClick}
                        width={`${radius * 2}px`}
                        height={`${radius * 2}px`}
                    />
                )
        )
    }
}

ColourWheel.propTypes = {
    radius: PropTypes.number.isRequired,
    lineWidth: PropTypes.number.isRequired,
    colours: PropTypes.array,
    shades: PropTypes.number,
    padding: PropTypes.number,
    dynamicCursor: PropTypes.bool,
    spacers: PropTypes.object,
    preset: PropTypes.bool,
    componentToHex: PropTypes.func,
    setPresetColour: PropTypes.func,
    onCenterCircleClick: PropTypes.func
}

ColourWheel.defaultProps = {
    colours: hexStrings,
    shades: 16,
    padding: 0,
    dynamicCursor: true,
    preset: false,
    animate: false
}

export default ColourWheel;