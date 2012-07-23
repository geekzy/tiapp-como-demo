module.exports = function (Como) {
    "use strict";
    var // include underscore utility-belt
        _ = require('/lib/Underscore/underscore.min'),
        // include Como Utility
        $ = require('/lib/Como/Utils'),
        // load UI Helper
        UI = Como.loadUI(),
        // include Progress Bar UI
        ProgressBar = require('/app/views/common/ProgressBar'),

        // create a window
        self = new UI.win($.extend(
            // base (common) attributes
            Como.ui.win.common,
            // cuctom attributes
            { titleid: 'winMain', exitOnClose: true }
        )),
        // scroll view as container
        scrolly = new UI.scrolly({contentHeight: 'auto'}),
        // create buttons
        btnTest = new UI.button($.extend(
            Como.ui.buttons.badass,
            { titleid: 'btnTest', abc: 'xyz' }
        )),
        loggedin = Como.db.models.get('user').count() > 0,
        btnLogin = new UI.button($.extend(
            Como.ui.buttons.badass,
            { titleid: (loggedin ? 'btnUser' : 'btnLogin'), top: '80dp' }
        )),
        btnChoose = new UI.button($.extend(
            Como.ui.buttons.badass,
            { titleid: 'btnChoose', top: '140dp' }
        )),
        // create option dialog
        optDlg = new UI.optdialog({
            cancel: 1,
            titleid: 'optDlgTitle',
            options: [L('optConfirm'), L('optCancel'), L('optHelp')],
            selectedIndex: 1,
            destructive: 0
        }),
        btnAjax = new UI.button($.extend(
            Como.ui.buttons.badass,
            { titleid: 'btnAjax', top: '200dp' }
        )),
        lblSwipe = new UI.label({
            textid: 'lblSwipe',
            color: '#272e12',
            font: { fontSize: '20dp', fontWeight: 'bold' },
            height: '44dp', top: '260dp'
        }),
        btnDownload = new UI.button($.extend(
            Como.ui.buttons.badass,
            { titleid: 'btnDownload', top: '320dp' }
        )),
        btnCheckOnline = new UI.button($.extend(
            Como.ui.buttons.badass,
            { titleid: 'btnCheckOnline', top: '380dp' }
        )),
        progress = new ProgressBar(Como, { message: L('msgDownload') }),
        choose = Como.applyAction('Try/doChoose');

    // listen to tap event
    btnTest.on('tap', 'Try/doSave', btnTest.getHeight());
    btnChoose.on('tap', function () {
        optDlg.on('click', true, choose);
        optDlg.show();
    });
    btnAjax.on('tap', 'Test/doAjax');
    btnDownload.on('tap', 'Try/doDownload', progress);
    btnCheckOnline.on('tap', 'Try/doCheckOnline');

    // listen to click event [backwards compatible]
    btnLogin.click('Test/showLogin');

    // listen to swipe event
    scrolly.on('swipe', 'Try/doSwipe');

    // listen to taphold event
    scrolly.on('taphold', function (e) {
        // prevent event bubbling from children's tap event
        if (e.source === scrolly) {
            Ti.API.info('Window Tap Hold!');
            // fire custom event
            var x = Math.round(Math.random()) === 1;
            scrolly.fireEvent('winTap', {p1: x ? 'xxx' : 'yyy'});
        }
    });

    // listen to custom event
    scrolly.addEventListener('winTap', Como.applyAction('Try/doManual', 'x', 1, true));

    // add ui to a container
    scrolly.add(btnTest);
    scrolly.add(btnLogin);
    scrolly.add(btnChoose);
    scrolly.add(btnAjax);
    scrolly.add(lblSwipe);
    scrolly.add(btnDownload);
    scrolly.add(btnCheckOnline);
    scrolly.add(progress);
    // add container to window
    self.add(scrolly);

    // return this window
    return self;
};
