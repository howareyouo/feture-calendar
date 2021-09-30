# Feture Calendar 🍦

> Picking feture dates.

## Demo
__[Click me!](https://howareyouo.github.io/feture-calendar)__

## Screenshot
![截图](https://images.gitee.com/uploads/images/2019/0315/095500_358dedc2_10015.png "屏幕截图.png")

## Usage

```html
<link href="src/feture-calendar.css" rel="stylesheet">
<div id="f-cal"></div>
```

```html
<script src="src/feture-calendar.js"></script>
<script>
window.addEventListener('load', function () {
  new FetureCalendar(document.getElementById('f-cal'), options)
})
</script>
```

## Default Options
```javascript
var defaults = {
  months: 3,    // initial months
  max: 12,      // max months
  format: 'mm月dd日',      // dateformat, supports yyyy,mm,dd
  range: ['入住', '离店'],  // range text, if unset, select only one date
  i18n: {
    unit: '晚',
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    today: '今天',
    y: '年',
    m: '月',
    d: '日'
  },
  disablePast: true,
  onSelect: console.log
}
```

### Development

1. Install dependencies

```bash
npm install
```

2. Watch JS/CSS

```bash
npm run watch
```

### Welcome to feedback for any bugs.

> This project was inspired by [Vanilla JS Calendar](https://github.com/chrisssycollins/vanilla-calendar) - [@chrisssycollins](https://github.com/chrisssycollins).
