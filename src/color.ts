// Copyright Bruno Marotta. 2021. All Rights Reserved.
// Node module: mini-color
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
// Inspired by: https://gist.github.com/neolitec/1344610/3a3a9dc7d94644ff48f12cc7823b79f2b8ea17ac

export interface HSL {
    h: number;
    s: number;
    l: number;
}

export interface Hsla extends HSL {
    a: number;
}

export interface Rgb {
    r: number;
    g: number;
    b: number;
}

export interface Rgba extends Rgb {
    a: number;
}

const HSLA_REGEX = /^hsla?\(\s*(\d{1,3}(?:\.\d+)?%?)\s*,\s*(\d{1,3}(?:\.\d+)?%)\s*,\s*(\d{1,3}(?:\.\d+)?%)(?:,\s*(0?\.\d+%?))?\)$/;
const RGBA_REGEX = /^rgba?\((\d{1,3}(?:\.\d+)?%?),\s*(\d{1,3}(?:\.\d+)?%?),\s*(\d{1,3}(?:\.\d+)?%?)(?:,\s*(0?\.?\d+%?))?\)$/;
export class Color {
    /**
     * The red color component. Stored as a number from 0 to 255
     */
    private r = 0;

    /**
     * The green color component. Stored as a number from 0 to 255
     */
    private g = 0;

    /**
     * The blue color component. Stored as a number from 0 to 255
     */
    private b = 0;

    /**
     * The alpha color component. Stored as a number from 0 to 1
     */
    private a = 1;

    /**
     * Creates a new black color instance of the Color object
     */
    constructor(r: number | Rgb | Rgba | string = 0, g?: number, b?: number, a?: number) {
        if (typeof r === "string") {
            this.parse(r);
        } else if (typeof r === "number") {
            this.rgba = { r: r, g: g ?? 0, b: b ?? 0, a: a ?? 1 };
        } else {
            this.rgba = <Rgba>r;
        }
    }

    toString() {
        // Default string is hex string
        return this.tohexString();
    }

    /* Rgb functions */

    /**
     * The red channel as a number from 0 to 255
     */
    get red(): number {
        return this.r;
    }
    set red(value: number) {
        value = this.sanitizeRgbValue(value);
        this.r = value;
    }

    /**
     * The green channel as a number from 0 to 255
     */
    get green(): number {
        return this.g;
    }
    set green(value: number) {
        value = this.sanitizeRgbValue(value);
        this.g = value;
    }
    /**
     * The blue channel as a number from 0 to 255
     */
    get blue(): number {
        return this.b;
    }
    set blue(value: number) {
        value = this.sanitizeRgbValue(value);
        this.b = value;
    }

    /**
     * The alpha (transparency) as a number from 0 to 1
     */
    get alpha(): number {
        return this.a;
    }
    /**
     * The alpha (transparency) as a number from 0 to 1
     */
    set alpha(value: number) {
        // Make sure we have a number. If not default to 0
        if (value === undefined || typeof value !== "number" || isNaN(value)) {
            this.a = 1;
        } else {
            if (value < 0) {
                value = 0;
            } else if (value > 1) {
                value = 1;
            }
            this.a = value;
        }
    }

    /**
     * The Color as an Rgb structure
     */
    get rgb(): Rgb {
        // typcasting is not enough as the a property comes together
        return { r: this.r, g: this.g, b: this.b };
    }
    set rgb(value: Rgb) {
        // Use the setters to sanitize the values
        this.red = value.r;
        this.green = value.g;
        this.blue = value.b;
    }

    /**
     * The Color as an Rgba structure
     */
    get rgba(): Rgba {
        return <Rgba>(<unknown>this);
    }
    set rgba(value: Rgba) {
        // Use the setters to sanitize the values
        this.red = value.r;
        this.green = value.g;
        this.blue = value.b;
        this.alpha = value.a;
    }

    /**
     * The Color as an Rgba structure where the alpha also ranges from 0 to 255
     */
    get rgbaByte(): Rgba {
        return {
            r: this.r,
            g: this.g,
            b: this.b,
            a: this.a * 255
        };
    }

    private sanitizeRgbValue(value: number) {
        // Make sure we have a number. If not default to 0
        if (value === undefined || typeof value !== "number" || isNaN(value)) {
            value = 0;
        } else {
            // We store only integer numbers from 0 to 255
            value = Math.round(value);
            if (value < 0) {
                value = 0;
            } else if (value > 255) {
                value = 255;
            }
        }
        return value;
    }

    /**
     * Converts the color to a CSS rgb string
     * @returns The color as an rgb string
     */
    toRgbString(): string {
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    }

    /**
     * Converts the color to a CSS rgba string
     * @returns The color as an rgba string
     */
    toRgbaString(): string {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }

    private parseRgba(str: string) {
        const parts = RGBA_REGEX.exec(str);
        if (!parts || !parts.length || parts.length < 4 || parts.length > 5) {
            throw new Error(`Wrong rgb encoding. ${parts ? parts.length : 0} parts parsed. Expected 4 or 5: ${JSON.stringify(parts)}`);
        }
        this.red = Color.Convertor.numberOrPercentage(parts[1], 255, true);
        this.green = Color.Convertor.numberOrPercentage(parts[2], 255, true);
        this.blue = Color.Convertor.numberOrPercentage(parts[3], 255, true);
        if (parts.length == 5 && parts[4] !== undefined && parts[4] !== null) {
            this.alpha = Color.Convertor.numberOrPercentage(parts[4], 1, false);
        } else {
            this.a = 1;
        }
    }

    /* HSL functions */

    /**
     * The hue as a number from 0 to 360. This is a calculated value (use it wisely)
     */
    get hue(): number {
        return this.toHsla().h;
    }
    set hue(value: number) {
        const hsla = this.toHsla();
        hsla.h = value;
        this.fromHsla(hsla);
    }

    /**
     * Returns the color as an hsla structure
     */
    toHsla(): Hsla {
        return { a: this.a, ...Color.Convertor.rgbToHsl(<Rgb>(<unknown>this)) };
    }
    fromHsla(value: Hsla) {
        this.rgb = Color.Convertor.hslToRgb(value);
    }

    /**
     * Converts the color to an CSS hsl string
     * @returns The color as an hsl string
     */
    toHslString(): string {
        const hsl = this.toHsla();
        return `hsl(${hsl.h.toFixed(0)},${hsl.s.toPrecision(2)}%,${hsl.l.toPrecision(2)}%)`;
    }
    /**
     * Converts the color to an CSS hsla string
     * @returns The color as an hsla string
     */
    toHslaString(): string {
        const hsl = this.toHsla();
        return `hsla(${hsl.h.toFixed(0)},${hsl.s.toPrecision(2)}%,${hsl.l.toPrecision(2)}%,${this.a})`;
    }

    private parseHsla(str: string) {
        const parts = HSLA_REGEX.exec(str);
        if (!parts || parts.length < 4 || parts.length > 5) {
            throw new Error(`Wrong hsl encoding. ${parts ? parts.length : 0} parts parsed. Expected 4 or 5: ${JSON.stringify(parts)}`);
        }
        const rgb = Color.Convertor.hslToRgb({
            h: Color.Convertor.numberOrPercentage(parts[1], 360, true),
            s: parseFloat(parts[2]),
            l: parseFloat(parts[3])
        });
        this.rgb = rgb;
        if (parts.length == 5 && parts[4] !== undefined && parts[4] !== null) {
            this.alpha = Color.Convertor.numberOrPercentage(parts[4], 1, false);
        } else {
            this.a = 1;
        }
    }

    static newHslColor(h: HSL | Hsla | number, s?: number, l?: number, a?: number): Color {
        const paramAsNumbers = typeof h == "number";
        const hsl = paramAsNumbers ? { h: h, s: s ?? 0, l: l ?? 0 } : h;
        const rgb = Color.Convertor.hslToRgb(hsl);
        return new Color(rgb.r, rgb.g, rgb.b, (paramAsNumbers ? a : (<Hsla>hsl).a) ?? 1);
    }

    /* HEX Functions */

    tohexString(): string {
        return (
            "#" +
            this.r.toString(16).padStart(2, "0") +
            this.g.toString(16).padStart(2, "0") +
            this.b.toString(16).padStart(2, "0") +
            (this.a < 1 ? (this.a * 255).toString(16).padStart(2, "0") : "")
        );
    }
    private parseHex(value: string) {
        if (value && value.length && value.startsWith("#")) {
            value = value.substring(1, value.length);
        }
        Color.Validator.checkHEX(value);
        if (value.length == 3) {
            this.red = parseInt(value.substring(0, 1) + value.substring(0, 1), 16);
            this.green = parseInt(value.substring(1, 2) + value.substring(1, 2), 16);
            this.blue = parseInt(value.substring(2, 3) + value.substring(2, 3), 16);
            this.a = 1;
        } else {
            this.red = parseInt(value.substring(0, 2), 16);
            this.green = parseInt(value.substring(2, 4), 16);
            this.blue = parseInt(value.substring(4, 6), 16);
            // Round the alpha to 3 decimals
            this.alpha = value.length == 8 ? Math.round((parseInt(value.substring(6, 8), 16) / 255) * 1000) / 1000 : 1;
        }
    }

    parse(str: string) {
        if (typeof str == "undefined" || (str = str.trim().toLowerCase()).length == 0) {
            throw new Error("Cannot parse an empty string");
        }
        if (str.startsWith("#")) {
            this.parseHex(str);
        } else if (str.startsWith("rgb")) {
            this.parseRgba(str);
        } else if (str.startsWith("hsl")) {
            this.parseHsla(str);
        } else {
            throw new Error("Unrecognized color string format: " + str);
        }
    }

    static Validator = {
        /**
         * Check a hexa color (without #)
         */
        checkHEX: function (value: string) {
            if (!value || (value.length != 6 && value.length != 8 && value.length != 3)) {
                throw new Error("Invalid hexa color length (" + value.length + ")," + value);
            }
            value = value.toLowerCase();
            for (let i = 0; i < value.length; i++) {
                const c = value.charCodeAt(i);
                if (!((c >= 48 && c <= 57) || (c >= 97 && c <= 102))) {
                    throw new Error("Hexa color out of range for " + value + " at position " + i);
                }
            }
        }
    };

    static Convertor = {
        /**
         * Converts an rgb color to hsl
         * @param rgb The color to be converted
         */
        rgbToHsl(rgb: Rgb): HSL {
            //
            const res: HSL = { h: 0, s: 0, l: 0 };
            const r = Math.min(1, Math.max(0, rgb.r / 255)),
                g = Math.min(1, Math.max(0, rgb.g / 255)),
                b = Math.min(1, Math.max(0, rgb.b / 255)),
                max = Math.max(r, g, b),
                min = Math.min(r, g, b);
            res.l = (max + min) / 2;
            if (max == min) {
                res.h = res.s = 0; // achromatic
            } else {
                const d = max - min;
                res.s = res.l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        res.h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        res.h = (b - r) / d + 2;
                        break;
                    case b:
                        res.h = (r - g) / d + 4;
                        break;
                }
                res.h /= 6;
            }
            // Converts to the expected range
            res.h = Math.round(res.h * 360);
            res.s = Math.round(res.s * 100000) / 1000;
            res.l = Math.round(res.l * 100000) / 1000;
            return res;
        },

        /**
         * Converts an hsl color to rgb
         * @param hsl The color to be converted
         */
        hslToRgb(hsl: HSL): Rgb {
            let h = Math.min(360, Math.max(0, hsl.h % 360));
            const s = Math.min(1, Math.max(0, hsl.s / 100)),
                l = Math.min(1, Math.max(0, hsl.l / 100)),
                hue2rgb = function hueToRgb(t1: number, t2: number, hue: number) {
                    if (hue < 0) {
                        hue += 6;
                    }
                    if (hue >= 6) {
                        hue -= 6;
                    }
                    if (hue < 1) {
                        return (t2 - t1) * hue + t1;
                    } else if (hue < 3) {
                        return t2;
                    } else if (hue < 4) {
                        return (t2 - t1) * (4 - hue) + t1;
                    } else {
                        return t1;
                    }
                };
            h = h / 60;
            let t2;
            if (l <= 0.5) {
                t2 = l * (s + 1);
            } else {
                t2 = l + s - l * s;
            }
            const t1 = l * 2 - t2;
            const r = Math.round(hue2rgb(t1, t2, h + 2) * 255);
            const g = Math.round(hue2rgb(t1, t2, h) * 255);
            const b = Math.round(hue2rgb(t1, t2, h - 2) * 255);
            return { r: r, g: g, b: b };
        },

        numberOrPercentage(value: string, range: number, isInt: boolean): number {
            const isPercentage = value.endsWith("%");
            let res = isInt && !isPercentage ? parseInt(value) : parseFloat(value);
            if (isPercentage) {
                res = (res / 100) * range;
                if (isInt) {
                    res = Math.round(res);
                }
            }
            return res;
        }
    };

    clone() {
        return new Color(this.r, this.g, this.b, this.a);
    }

    getHashCode(): string {
        return this.toRgbaString();
    }

    // https://stackoverflow.com/questions/9018016/how-to-compare-two-colors-for-similarity-difference
    static colorDistance(e1: Rgb, e2: Rgb, normalize = false): number {
        const rmean = (e1.r + e2.r) / 2;
        const r = e1.r - e2.r;
        const g = e1.g - e2.g;
        const b = e1.b - e2.b;
        const res = Math.sqrt((((512 + rmean) * r * r) >> 8) + 4 * g * g + (((767 - rmean) * b * b) >> 8));
        return normalize ? res / 764.8333151739665 : res;
    }
} // END class
