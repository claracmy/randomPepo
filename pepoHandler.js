(function() {
    var HttpResponse = Packages.com.gmt2001.HttpResponse,
        HttpRequest = Packages.com.gmt2001.HttpRequest,
        HashMap = Packages.java.util.HashMap,
        loaded = false,
        cache = [],
        last = '',
        client_id = 'b1926d7f59ebd08'; // Put your imgur client id here.

    /*
     * @function load
     */
    function load() {
        var hashMap = new HashMap(),
            jsonString,
            jsonObject,
            i;

        if (loaded === true) {
            return;
        }

        hashMap.put('Authorization', 'Client-ID ' + client_id);

        jsonString = HttpRequest.getData(HttpRequest.RequestType.GET, 'https://api.imgur.com/3/album/H7Ec4/images', '', hashMap);

        try {
            jsonObject = JSON.parse(jsonString.content);
        } catch (jsonEx) {
            $.log.error('Failed to parse jsonString: ' + jsonEx.message);
            return;
        }

        for (i in jsonObject.data) {
            cache.push(jsonObject.data[i].link);
        }
        loaded = true;
    }

    /*
     * @function randompepo
     */
    function randompepo(channel) {
        var random;
        if (cache.length !== 0) {
            do {
                random = $.randElement(cache);
            } while (random == last);

            last = random;

            $.discord.say(channel, random);
        } else {
            $.discord.say(channel, 'pepo cache is not loaded.');
        }
    }

    $.bind('discordCommand', function(event) {
        var sender = event.getSender(),
            channel = event.getChannel(),
            command = event.getCommand();

        if (command.equalsIgnoreCase('pepo')) {
            randompepo(channel);
        }
    });

    $.bind('initReady', function() {
        $.discord.registerCommand('./discord/commands/pepoHandler.js', 'pepo', 0);
        if (loaded === false && cache.length === 0) {
            setTimeout(function() { load(); }, 1); // Load this on a new thread.
        }
    });
})();
