/**
 * chuck.norris.js
 */

(function() {
    var socket      = null,
        nickname    = '',
        options     = {
            host : 'localhost',
            port : 1337,
            ns   : 'chucknorris'
        };

    getNickname(function(n) {
        nickname = n;
        socket = io.connect('http://' + options.host + ':' + options.port + '/' + options.ns);

        socket.on('connect', function() {
            socket.emit('nickname', nickname);

            socket.on('ready', function(facts) {
                $('body').show();
                facts.forEach(shout);

                $('#fact').bind('keypress', postFact).focus();
                $('#send').bind('click', postFact);

                socket.on('message', shout);
            });
        });
    });

    function getNickname(callback) {
        var nickname;

        do {
            nickname = prompt('Enter a nickname: ');
        } while (
            'string' !== typeof nickname
            || !nickname.length
        );

        callback(nickname);
    }

    function postFact(e) {
        var keyCode = e.keyCode ? e.keyCode : e.which;

        if (
            'keypress' === e.type
            && 13 !== keyCode
        ) {
            return;
        }

        var message = $('#fact').val(),
            data    = {
                from    : nickname,
                message : message
            };

        socket.emit('message', data);
        shout(data);
    }

    function shout(data) {
        var from    = data.from,
            message = data.message;

        $('<div>').addClass('fact')
            .append('<div class="nick">' + from + '</div>')
            .append('<div class="message">' + message + '</div>')
            .prependTo('#facts');

        $('#fact').val('').focus();
    }
})();
