module.exports = {
	checkDelay: 2.5, // In Seconds
	maxPriceBulk: 90.0, // Max price of slave using purchaser
	maxPriceScrap: 135.0, // Same here but for scrapper
	maxPriceBind: 4000000.0,
	startId: 611916, // Стартовый айди для булк-закупки
	logParams: {
		display_checkLog: true, // enable 
	},

	defaultJob: 'Рабочий',
	defaultUserID: 1, // пашок лично бота юзал (ноу кэп)

	authHeader: `Bearer vk_access_ <...> и так далее`,
	userAgent: `вставь сюда своего юзер агента`
}