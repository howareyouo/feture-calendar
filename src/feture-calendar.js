// var monthes = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
function FetureCalendar (el, options) {
  this.body = document.querySelector('.fc-body')
  this.today = new Date()
  this.date = new Date()
  this.options = Object.assign({
    onSelect: function (date) {
      console.log(date)
    }
  }, options)
  this.date.setDate(1)
  el.classList.add('fc')
  this.appendMonths(3)
  this.attachListeners()
}
FetureCalendar.prototype.appendMonths = function (n) {
  var date = this.date
  while (n--) {
    var current = date.getMonth()
    var month = document.createElement('div')
    var days = document.createElement('div')
    month.innerHTML = date.getFullYear() + '年' + (date.getMonth() + 1) + '月'
    month.className = 'fc-month'
    days.className = 'fc-days'
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
  } else {
    dayEl.classList.add('fc-day-active')
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
  this.body.addEventListener('click', function (e) {
    var target = e.target,
        tag    = target.tagName
    if (tag != 'EM' && tag != 'B') {
      return
    }
    if (tag == 'B') {
      target = target.parentNode
    }
    _this.options.onSelect(new Date(target.date))
    _this.removeActiveClass()
    target.classList.toggle('fc-day-selected')
  })
}
FetureCalendar.prototype.removeActiveClass = function () {
  document.querySelectorAll('.fc-day-active').forEach(function (e) {
    e.classList.remove('fc-day-selected')
  })
}
