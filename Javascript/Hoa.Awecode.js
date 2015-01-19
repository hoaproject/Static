if(undefined === Hoa)
    var Hoa = {};

Hoa.Patch = Hoa.Patch || function ( original, oninsert, ondelete, onend ) {

    var text = null;

    this.resetText = function ( newText ) {

        text = newText.split("\n");
    };

    this.apply = function ( diff, editor ) {

        if(undefined == diff)
            return;

        var out    = [];
        var mtchs  = null;
        var handle = null;

        diff.split('\n').forEach(function ( element, index ) {

            switch(element.charAt(0)) {

                case '@':
                    handle = /^@@ -(\d+),(\d+)/.exec(element);

                    if(null === mtchs)
                        mtchs = {1: 1, 2: 0};

                    handle[1] = parseInt(handle[1]);
                    handle[2] = parseInt(handle[2]);

                    for(var i = mtchs[1] + mtchs[2] - 1,
                            max = handle[1] - 1;
                        i < max;
                        ++i)
                        out.push(text[i]);

                    mtchs = handle;
                  break;

                case '+':
                    var el = element.substring(1);
                    var i  = out.push(el) - 1;
                    text.splice(i, 0, el);
                    oninsert(i, el, editor);
                  break;

                case ' ':
                    out.push(element.substring(1));
                  break;

                case '-':
                    text.splice(out.length, 1);
                    ondelete(out.length, element.substring(1), editor);
                  break;
            }
        });

        onend(editor);

        return this;
    };

    this.toString = function ( ) {

        return text.join('\n');
    };

    this.resetText(original);
};

Hoa.ℙ(1) && Hoa.namespace([HTMLDivElement], {

    guard: function ( element ) {

        return    true     === element.hasAttribute('role')
               && 'slider' === element.getAttribute('role');
    },

    body : function ( element ) {

        var button      = Hoa.$('[role="button"]', element);
        var buttonWidth = button.getBoundingClientRect().width;
        var tooltip     = Hoa.$('[role="tooltip"]', element);
        var getWidth    = function ( ) {

            return element.getBoundingClientRect().width;
        };
        var getHeight   = function ( ) {

            return element.getBoundingClientRect().height;
        };
        var formatter   = null

        var out = {

            setValue: function ( value ) {

                var min   = this.getMinValue();
                var max   = this.getMaxValue();
                var width = getWidth();
                value     = Math.max(min, Math.min(max, value));

                var relative = ((value - min) * 100) / (max - min);
                var left     = (relative * width) / 100 - buttonWidth / 2;
                left         = Math.max(0, Math.min(width - buttonWidth, left));
                relative     = left * 100 / width;

                element.setAttribute('aria-valuenow', value);
                button.style.left = relative + '%';
                this.format(value);

                return this;
            },

            setValueFromWidth: function ( value ) {

                var min    = this.getMinValue();
                var max    = this.getMaxValue();
                var width  = getWidth();
                value      = Math.max(0, Math.min(width, value));
                var _value = (value * (max - min)) / width;
                element.setAttribute('aria-valuenow', _value);

                value = Math.max(
                    0,
                    Math.min(width - buttonWidth, value - buttonWidth / 2)
                );
                button.style.left = value + 'px';
                this.format(_value);

                return _value;
            },

            setMinValue: function ( value ) {

                element.setAttribute('aria-valuemin', value);

                return this;
            },

            setMaxValue: function ( value ) {

                element.setAttribute('aria-valuemax', value);

                return this;
            },

            getValue: function ( ) {

                return element.getAttribute('aria-valuenow');
            },

            getMinValue: function ( ) {

                return element.getAttribute('aria-valuemin');
            },

            getMaxValue: function ( ) {

                return element.getAttribute('aria-valuemax');
            },

            setFormatter: function ( callback ) {

                formatter = callback;

                return this;
            },

            format: function ( value ) {

                if(null === formatter)
                    return this;

                if(undefined === value)
                    value = out.getValue();

                tooltip.innerHTML = formatter(value);

                return this;
            },

            isSeeking: function ( ) {

                return seeking;
            },

            onseek: function ( callback ) {

                _seek = callback;

                return this;
            }
        };

        var seeking = false;
        var seek    = function ( evt ) {

            _seek(out.setValueFromWidth(
                evt.clientX - element.getBoundingClientRect().left
            ));
        };
        var _seek   = Hoa.nop;
        var onmove  = function ( evt ) {

            seek(evt);

            evt.preventDefault();
            evt.stopPropagation();
        };

        element.addEventListener('mousedown', function ( evt ) {

            seeking = true;
            document.body.classList.toggle('unselectable');
            button.setAttribute('aria-selected', 'true');
            seek(evt);
            document.body.addEventListener('mousemove', onmove);
        }, false);

        document.body.addEventListener('mouseup', function ( evt ) {

            if(false === seeking)
                return;

            seeking = false;
            document.body.removeEventListener('mousemove', onmove, false);
            document.body.classList.toggle('unselectable');
            button.setAttribute('aria-selected', 'false');

            evt.preventDefault();
        }, false);


        out.setValue(out.getValue());

        return out;
    }
});

Hoa.ℙ(1) && Hoa.namespace([HTMLElement], {

    guard: function ( element ) {

        return   'CODE' === element.tagName
               && null  !== element.className.match(/language\-/);
    },
    body : function ( element ) {

        var lineHeight  = parseFloat(window.getComputedStyle(element).lineHeight);
        var markedLines = [];

        return {

            lineNumber: function ( ) {

                return (this.getLines().match(/\n/g) || []).length + 1;
            },

            setLine: function ( i, line ) {

                var n = this.lineNumber();

                if(i <= n) {

                    element.textContent = this.getLines().replace(
                        new RegExp(
                            '^((?:[^\\n]*\\n){' + (i - 1) + '})' +
                            '([^\\n]*|[^$]*)'
                        ),
                        '$1' + line
                    )

                    return this;
                }

                var handle = '';

                for(; i > n; --i)
                    handle += '\n';

                element.textContent += handle + line;

                return this;
            },

            getLine: function ( i ) {

                return (this.getLines().match(new RegExp(
                    '^(?:[^\\n]*\\n){' + (i - 1) + '}([^\\n]*|[^$]*)'
                )) || [, ''])[1];
            },

            setLines: function ( lines ) {

                element.textContent = lines;

                return this;
            },

            getLines: function ( ) {

                return element.textContent;
            },

            insertLine: function ( i, line ) {

                return this.setLine(i, line + '\n' + this.getLine(i));
            },

            removeLine: function ( i ) {

                element.textContent = this.getLines().replace(
                    new RegExp(
                        '^((?:[^\\n]*\\n){' + (i - 1) + '})' +
                        '(?:[^\\n]*\\n|[^$]*)'
                    ),
                    '$1'
                );

                return this;
            },

            highlight: function ( ) {

                if(undefined !== Prism)
                    Prism.highlightElement(element);

                return this;
            },

            markLines: function ( lines, marker, classes ) {

                this.unmarkAllLines();
                var _lines = lines.replace(/\s+/g, '').split(',');

                _lines.forEach(function ( line ) {

                    var _line = Hoa.DOM.div(
                        ' ',
                        {
                            'data-start' : line,
                            'class'      : 'line-marker ' + (classes || ''),
                            'data-marker': marker || ''
                        }
                    );

                    _line.style.top = (line - 1) * lineHeight + 'px';
                    element.parentNode.appendChild(_line);

                    markedLines.push(_line);
                });
            },

            unmarkAllLines: function ( ) {

                markedLines.forEach(function ( line ) {

                    element.parentNode.removeChild(line);
                });
                markedLines = [];

                return;
            }
        };
    }
});

Hoa.Awecode = Hoa.Awecode || function ( awecodeId, vimeoId ) {

    var that        = this;
    var video       = null;
    var editors     = {};
    var tabs        = Hoa.Tabs.get(Hoa.$('#' + awecodeId + ' [data-tabs]'));
    var slider      = Hoa.$('#' + awecodeId + ' [role="slider"]').hoa;
    var subtitler   = Hoa.$('#' + awecodeId + ' [role="checkbox"].subtitle');
    var currentTime = -1;
    var seeked      = false;
    var patchEffect = new function ( ) {

        var q = new Hoa.Concurrent.Scheduler();

        return {

            insert: function ( number, line, editor ) {

                ++number;

                q.schedule(function ( ) {

                     editor.markLines(number + '', '➜', 'line-insert');
                })
                .wait(100)
                .schedule(function ( ) {

                    this.wait();
                    var i    = 1;
                    var that = this;
                    editor.insertLine(number, line.substr(0, i++));

                    Hoa.Concurrent.every(
                        35,
                        function ( ) {

                            editor.setLine(number, line.substring(0, i))
                                  .highlight();

                            if(i++ >= line.length) {

                                this.stop();
                                that.terminate();
                            }
                        }
                    );
                })
                .wait(100)
                .schedule(function ( ) {

                    editor.unmarkAllLines();
                })

                return;
            },

            delete: function ( number, line, editor ) {

                ++number;

                q.schedule(function ( ) {

                    editor.markLines(number + '', '✖', 'line-remove')
                })
                .wait(200)
                .schedule(function ( ) {

                    editor.removeLine(number)
                          .highlight();
                })
                .wait(400)
                .schedule(function ( ) {

                    editor.unmarkAllLines();
                });

                return;
            },

            end: function ( ) {

                q.spawn();

                return;
            }
        };
    };

    slider.setFormatter(function ( value ) {

        var min = Math.floor(value / 60);
        var sec = Math.floor(value % 60);

        if(sec < 10)
            sec = '0' + sec;

        return min + ':' + sec;
    });
    slider.format();
    slider.onseek(function ( value ) {

        seeked = true;
        var c = Math.floor(value);

        if(c === currentTime)
            return;

        currentTime = c;
        video.currentTime(value);
    });

    subtitler.addEventListener('click', function ( ) {

        if('true' === this.getAttribute('aria-selected')) {

            video.disable('subtitle');
            this.setAttribute('aria-selected', 'false');
        }
        else {

            video.enable('subtitle');
            this.setAttribute('aria-selected', 'true');
        }
    });

    document.documentElement.classList.toggle('light');

    Popcorn.plugin('awecode', {

        _setup: function ( options ) {

            if(!options.setup)
                return;

            this.on('durationchange', function ( ) {

                slider.setMaxValue(video.media.duration);
            });

            this.on('timeupdate', function ( ) {

                var c = Math.floor(video.media.currentTime);

                if(c === currentTime)
                    return;

                currentTime = c;

                if(false === slider.isSeeking())
                    slider.setValue(c);
            });

            this.on('ended', function ( ) {

                slider.setValue(slider.getMaxValue());
            });
        },

        start: function ( target, options ) {

            if(options.setup)
                return;

            var bucket  = editors[options.editor];
            var editor  = bucket.editor;
            var key     = options.key;

            tabs.select(bucket.index);

            if(true === seeked) {

                seeked = false;

                editors.hoa.forEach(function ( edId ) {

                    var ed        = editors[edId];
                    var keyframes = ed.keyframes;
                    var lines     = '';

                    keyframes.forEach(function ( frame ) {

                        if(frame.key <= key)
                            lines = frame.computed;

                        return;
                    });

                    ed.editor.setLines(lines).highlight();
                    ed.patch.resetText(lines);
                });
            }
            else {

                if(false === slider.isSeeking())
                    bucket.patch.apply(options.diff, editor);
                else
                    editor.setLines(options.computed)
                          .highlight();
            }
        }
    });

    var handle = Popcorn.HTMLVimeoVideoElement('#' + awecodeId + ' .video');
    handle.src = 'http://player.vimeo.com/video/' + vimeoId;
    video      = Popcorn(handle);
    video.awecode({setup: true});

    this.declare = function ( data, delay ) {

        var index = 0;
        var key   = 1;
        delay     = delay || 11;

        data.forEach(function ( frame ) {

            var tabPanel = tabs.add(frame.id, frame.name);
            var language = 'language-';

            if(/\.php$/.test(frame.name))
                language += 'php';
            else if(/\.html$/.test(frame.name))
                language += 'markup';
            else if(/\.css$/.test(frame.name))
                language += 'css';

            var code = Hoa.DOM.code('', {'class': language});
            tabPanel.appendChild(
                Hoa.DOM.pre(
                    [code],
                    {'data-editor': 'true'}
                )
            );
            editors[frame.id] = {
                index  : index++,
                editor : code.hoa,
                patch  : new Hoa.Patch(
                    '',
                    patchEffect.insert,
                    patchEffect.delete,
                    patchEffect.end
                )
            };

            var patch = new Hoa.Patch('', Hoa.nop, Hoa.nop, Hoa.nop);

            editors[frame.id].keyframes = (function ( ) {

                var keyframes = [];

                frame.keyframes.forEach(function ( keyframe ) {

                    keyframe.start   += delay;
                    keyframe.end     += delay;
                    keyframe.key      = key++;
                    keyframe.editor   = frame.id;
                    keyframe.computed = patch.apply(keyframe.diff, null).toString();
                    keyframes.push(keyframe);

                    video.awecode(keyframe);
                });

                return keyframes;
            })();
        });

        return;
    };

    this.subtitle = function ( uri ) {

        video.parseSRT(uri);

        return;
    }
};
