// var monthes = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
function _createElement (tag, clazz, html) {
  var el = document.createElement(tag)
  if (clazz) {
    el.className = clazz
  }
  if (html) {
    el.innerHTML = html
  }
  return el
}

function FetureCalendar (el, options) {
  this.today = new Date()
  this.date = new Date()
  this.date.setDate(1)
  this.options = Object.assign({
    i18n: {
      weeks: ['日', '一', '二', '三', '四', '五', '六']
    },
    onSelect: function (date) {
      console.log(date)
    }
  }, options)
  el.classList.add('fc')
  var weeks = this.options.i18n.weeks
  var week = _createElement('div', 'fc-week')
  for (var i in weeks) {
    week.appendChild(_createElement('span', null, weeks[i]))
  }
  this.body = _createElement('div', 'fc-body')
  el.appendChild(week)
  el.appendChild(this.body)
  this.appendMonths(3)
  this.attachListeners()
}

FetureCalendar.prototype.appendMonths = function (n) {
  var date = this.date
  while (n--) {
    var current = date.getMonth()
    var month = _createElement('div', 'fc-month', date.getFullYear() + '年' + (date.getMonth() + 1) + '月')
    var days = _createElement('div', 'fc-days')
    this.body.appendChild(month)
    while (date.getMonth() === current) {
      this.appendDays(date.getDate(), date.getDay(), days)
      date.setDate(date.getDate() + 1)
    }
    this.body.appendChild(days)
  }
  // while loop trips over and day is at 30/31, bring it back
  date.setDate(1)
  date.setMonth(date.getMonth() - 1)
}

FetureCalendar.prototype.appendDays = function (day, weekday, container) {
  var disabled = this.options.disablePast && this.date.getTime() <= this.today.getTime() - 1
  var today = this.date.toDateString() === this.today.toDateString()
  var newDay = this.createDayElement(day, disabled, today)

  // if it's the first day of the month
  if (day == 1 && weekday != 0) {
    newDay.style.marginLeft = weekday * 14.2857 + '%'
    // for (var i = 0; i < weekday; i++)
    // this.month.appendChild(this.createDayElement(''))
  }
  container.appendChild(newDay)
  return container
}

FetureCalendar.prototype.createDayElement = function (day, disabled, today) {
  var dayEl = document.createElement('em')
  var numEl = document.createElement('b')
  numEl.innerHTML = day
  dayEl.className = 'fc-day'
  dayEl.date = this.date.getTime()

  if (disabled) {
    dayEl.classList.add('fc-day-disabled')
  }

  if (today) {
    dayEl.classList.add('fc-day-today')
    numEl.innerHTML = '今天'
  }

  dayEl.appendChild(numEl)
  return dayEl
}

FetureCalendar.prototype.attachListeners = function () {
  var _this = this

  // click event
  this.body.addEventListener('click', function (e) {
    var target = e.target,
        tag    = target.tagName
    if (tag != 'EM' && tag != 'B') {
      return
    }
    if (tag == 'B') {
      target = target.parentNode
    }
    if (target.classList.contains('fc-day-disabled')) {
      return
    }
    _this.options.onSelect(new Date(target.date))
    _this.removeActiveClass()
    target.classList.toggle('fc-day-selected')
  })
}

FetureCalendar.prototype.removeActiveClass = function () {
  document.querySelectorAll('.fc-day-selected').forEach(function (e) {
    e.classList.remove('fc-day-selected')
  })
}
