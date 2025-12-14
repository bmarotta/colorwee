import { Color } from "../src/color";

describe("color", () => {
    test("can create an empty color", async () => {
        const c = new Color();
        expect(c.red).toBe(0);
        expect(c.green).toBe(0);
        expect(c.blue).toBe(0);
        expect(c.alpha).toBe(1);
    });

    test("can create a color from numbers", async () => {
        const c = new Color(1, 2, 3, 4);
        expect(c.red).toBe(1);
        expect(c.green).toBe(2);
        expect(c.blue).toBe(3);
        expect(c.alpha).toBe(1);
    });

    test("can create a color from rgb(a)", async () => {
        const c1 = new Color({ r: 1.1, g: 2.2, b: 300 });
        expect(c1.red).toBe(1);
        expect(c1.green).toBe(2);
        expect(c1.blue).toBe(255);
        expect(c1.alpha).toBe(1);

        const c2 = new Color({ r: 1.1, g: 2.2, b: -1, a: 0.5 });
        expect(c2.red).toBe(1);
        expect(c2.green).toBe(2);
        expect(c2.blue).toBe(0);
        expect(c2.alpha).toBe(0.5);
    });

    test("can create a color from hex string", async () => {
        let c = new Color("#FFF");
        expect(c.red).toBe(255);
        expect(c.green).toBe(255);
        expect(c.blue).toBe(255);
        expect(c.alpha).toBe(1);

        c = new Color("#F0E0D0");
        expect(c.red).toBe(240);
        expect(c.green).toBe(224);
        expect(c.blue).toBe(208);
        expect(c.alpha).toBe(1);

        c = new Color("#01020380");
        expect(c.red).toBe(1);
        expect(c.green).toBe(2);
        expect(c.blue).toBe(3);
        expect(c.alpha).toBe(0.502);

        expect(() => new Color("")).toThrow(Error);
        expect(() => new Color("#0102")).toThrow(Error);
        expect(() => new Color("#0102")).toThrow(Error);
        expect(() => new Color("#abcdeg")).toThrow(Error);
    });

    test("can create a color from rgb(a) string", async () => {
        let c = new Color("rgb(123,321,111)");
        expect(c.red).toBe(123);
        expect(c.green).toBe(255);
        expect(c.blue).toBe(111);
        expect(c.alpha).toBe(1);

        c = new Color("rgba(123,321,111,.5)");
        expect(c.red).toBe(123);
        expect(c.green).toBe(255);
        expect(c.blue).toBe(111);
        expect(c.alpha).toBe(0.5);

        c = new Color("rgba(25%,50%,100%,50%)");
        expect(c.rgba).toEqual({ r: 64, g: 128, b: 255, a: 0.5 });

        c = new Color("rgba(25%,50%,100%,1)");
        expect(c.rgbaByte).toEqual({ r: 64, g: 128, b: 255, a: 255 });

        expect(() => new Color("rgb(123,3x21,111)")).toThrow(Error);
    });

    test("can create a color from hsl(a) string", async () => {
        let c = new Color("	hsl(195, 100%, 50%)");
        expect(c.red).toBe(0);
        expect(c.green).toBe(191);
        expect(c.blue).toBe(255);
        expect(c.alpha).toBe(1);

        c = new Color("hsla(0, 0%, 50%,.5)");
        expect(c.red).toBe(128);
        expect(c.green).toBe(128);
        expect(c.blue).toBe(128);
        expect(c.alpha).toBe(0.5);

        c = new Color("hsla(0, 0%, 50%,0)");
        expect(c.red).toBe(128);
        expect(c.green).toBe(128);
        expect(c.blue).toBe(128);
        expect(c.alpha).toBe(0);

        c = new Color("hsla(0, 0%, 50%,1)");
        expect(c.red).toBe(128);
        expect(c.green).toBe(128);
        expect(c.blue).toBe(128);
        expect(c.alpha).toBe(1);

        c = new Color("hsl(83.3333%, 100%, 25%)");
        expect(c.red).toBe(128);
        expect(c.green).toBe(0);
        expect(c.blue).toBe(128);
        expect(c.alpha).toBe(1);

        expect(() => new Color("hsl(195, 100, 50%)")).toThrow(Error);
        expect(() => new Color("hwl(195, 100%, 50%)")).toThrow(Error);
    });

    test("can create a color from hsl structure", async () => {
        let c = Color.newHslColor(195, 100, 50);
        expect(c.red).toBe(0);
        expect(c.green).toBe(191);
        expect(c.blue).toBe(255);
        expect(c.alpha).toBe(1);

        c = Color.newHslColor({ h: 0, s: 0, l: 50 });
        expect(c.red).toBe(128);
        expect(c.green).toBe(128);
        expect(c.blue).toBe(128);
        expect(c.alpha).toBe(1);

        c = Color.newHslColor({ h: 300, s: 100, l: 25, a: 0.5 });
        expect(c.red).toBe(128);
        expect(c.green).toBe(0);
        expect(c.blue).toBe(128);
        expect(c.alpha).toBe(0.5);
    });

    test("can convert from rgb to hsl", async () => {
        let hsl = Color.Convertor.rgbToHsl({ r: 0, g: 0, b: 0 });
        expect(hsl).toEqual({ h: 0, s: 0, l: 0 });

        hsl = Color.Convertor.rgbToHsl({ r: 123, g: 12, b: 1 });
        expect(hsl).toEqual({ h: 5, s: 98.387, l: 24.314 });

        hsl = Color.Convertor.rgbToHsl({ r: 15, g: 15, b: 240 });
        expect(hsl).toEqual({ h: 240, s: 88.235, l: 50 });

        const color = new Color("rgb(60,200,60)");
        const str = color.toHslString();
        expect(str).toEqual("hsl(120,56%,51%)");

        const hsla = color.toHsla();
        expect(hsla).toEqual({ h: 120, s: 56, l: 50.98, a: 1 });
    });

    test("can get and set (values and string)", async () => {
        const c = new Color();
        c.rgb = { r: 255, g: 255, b: 255 };

        expect(c.toString()).toBe("#ffffff");

        c.red = 240;
        c.alpha = 0.5;
        c.blue = -100;
        c.green = 300;
        expect(c.toRgbaString()).toBe("rgba(240,255,0,0.5)");

        c.rgba = { r: 60, g: 200, b: 60, a: 1 };
        expect(c.getHashCode()).toBe("rgba(60,200,60,1)");

        const h = c.hue;
        expect(h).toBe(120);

        c.hue = 150;
        expect(c.toHslString()).toBe("hsl(150,56%,51%)");

        c.alpha = -2;
        expect(c.toHslaString()).toBe("hsla(150,56%,51%,0)");
        expect(c.toRgbString()).toBe("rgb(60,200,130)");
        expect(c.rgb).toEqual({ r: 60, g: 200, b: 130 });
    });

    test("can clone", async () => {
        let color = new Color({ r: 123, g: 123, b: 123, a: 0.23 });
        let clone = color.clone();
        expect(clone.toString()).toBe(color.tohexString());

        color = new Color(123);
        clone = color.clone();
        expect(clone).toEqual(color);
    });

    test("can calculate color distance", async () => {
        let distance = Color.colorDistance({ r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0 }, true);
        expect(distance).toBe(0);

        distance = Color.colorDistance({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }, true);
        expect(distance).toBe(1);

        distance = Color.colorDistance({ r: 0, g: 0, b: 0 }, { r: 128, g: 128, b: 128 }, true);
        distance = Math.round(distance * 100) / 100;
        expect(distance).toBe(0.5);

        distance = Color.colorDistance({ r: 255, g: 255, b: 255 }, { r: 250, g: 255, b: 255 }, true);
        distance = Math.round(distance * 100) / 100;
        expect(distance).toBe(0.01);
    });
});
