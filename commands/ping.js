module.exports = {
    name: 'ping',
    description: 'Reply ping with pong!',
    execute(message, args, client) {

        const filter = m => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector(filter, {time: 15000});

        let colo = {
            rival: null,
            lifeforce_our: null,
            lifeforce_their: null,
        };

        let iterator = 'RIVAL';

        const emoji = client.emojis.cache.get('753083854239039498');
        message.channel.send(`Emoji test ${emoji}`);

        // collector.on('collect', m => {
        //
        //    if(iterator === 'RIVAL'){
        //        colo.rival = m.content;
        //        message.channel.send(`Our formidable opponent today is **${m.content}**, Next, please enter our lifeforce (without number formatting please)`);
        //        iterator = 'LF_OURS';
        //    }else if(iterator === 'LF_OURS'){
        //        colo.lifeforce_our = m.content;
        //        message.channel.send(`Today, we've gained **${m.content.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}** lifeforce`);
        //        iterator = 'LF_THEIRS';
        //    }else if(iterator === 'LF_THEIRS'){
        //        colo.lifeforce_their = m.content;
        //        message.channel.send(`They've gained **${m.content.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}** lifeforce`);
        //
        //        collector.stop('complete request');
        //    }
        //
        //     collector.on('end', collected => {
        //         console.log(`Collected ${collected.size} items`);
        //     });
        //
        // });
    }
}