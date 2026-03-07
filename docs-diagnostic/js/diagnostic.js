(function () {
    'use strict';

    /* ─── State ─── */
    var state = {
        currentQuestion: 0,
        answers: [],
        scores: { demand: 0, capacity: 0, experience: 0, behavior: 0, economics: 0, profit: 0 }
    };

    /* Maximum possible scores per category (max contribution per question, summed) */
    var maxScores = { demand: 8, capacity: 12, experience: 7, behavior: 10, economics: 7, profit: 2 };

    var categoryLabels = {
        demand: 'Demand',
        capacity: 'Capacity',
        experience: 'Experience',
        behavior: 'Behavior',
        economics: 'Economics',
        profit: 'Profit'
    };

    /* ─── Questions (derived from the Restaurant Money Model) ─── */
    var questions = [
        {
            /* Q1  - DEMAND (signal: Guest Count, Covers by period) */
            text: "During your peak window  - your busiest 60 to 90 minutes  - how full is your dining room?",
            options: [
                { letter: 'A', text: "Less than half full", scores: { demand: 3 } },
                { letter: 'B', text: "About half full", scores: { demand: 2 } },
                { letter: 'C', text: "Mostly full", scores: { demand: 1 } },
                { letter: 'D', text: "Full or overflowing  - turning people away", scores: { capacity: 2 } }
            ]
        },
        {
            /* Q2  - DEMAND lever check (model: wrong moves  - cutting labor, discounting) */
            text: "When demand slows, what is your first response?",
            options: [
                { letter: 'A', text: "Cut labor to protect the numbers", scores: { capacity: 2, demand: 1 } },
                { letter: 'B', text: "Run discounts or deals", scores: { demand: 2, economics: 1 } },
                { letter: 'C', text: "Review our offer, visibility, and access", scores: {} },
                { letter: 'D', text: "Haven\u2019t thought about it systematically", scores: { demand: 2 } }
            ]
        },
        {
            /* Q3  - CAPACITY (model: Constraint Monitors  - ticket times, kitchen chit time) */
            text: "During your busiest service, what happens?",
            options: [
                { letter: 'A', text: "Ticket times stretch, food sits in the window, mistakes increase", scores: { capacity: 3 } },
                { letter: 'B', text: "Servers are rushing, no time for recommendations, guests feel hurried", scores: { capacity: 2, experience: 1 } },
                { letter: 'C', text: "We hold it together  - team manages volume well", scores: {} },
                { letter: 'D', text: "We rarely get busy enough for this to be a problem", scores: { demand: 2 } }
            ]
        },
        {
            /* Q4  - CAPACITY / cross-layer ("Rushed is capacity overload showing up as experience failure") */
            text: "During the rush, can your servers guide guest decisions, or are they just trying to keep up?",
            options: [
                { letter: 'A', text: "Just keeping up  - no time for anything but taking orders and running food", scores: { capacity: 3, behavior: 1 } },
                { letter: 'B', text: "Some servers manage it, most are stretched", scores: { capacity: 2 } },
                { letter: 'C', text: "Most have room to guide and recommend even during the peak", scores: {} },
                { letter: 'D', text: "Plenty of time  - the room isn\u2019t full enough", scores: { demand: 1 } }
            ]
        },
        {
            /* Q5  - EXPERIENCE (model: Repeat Visit Rate  - Experience Integrity Indicator) */
            text: "What percentage of first-time guests come back within 60 days?",
            options: [
                { letter: 'A', text: "Very few return", scores: { experience: 3 } },
                { letter: 'B', text: "Maybe a quarter come back", scores: { experience: 2 } },
                { letter: 'C', text: "About half return", scores: { experience: 1 } },
                { letter: 'D', text: "Most come back  - strong repeat business", scores: {} }
            ]
        },
        {
            /* Q6  - EXPERIENCE / Value Equation (Consistency, Speed, Friction + Emotional Flatness) */
            text: "Which best describes your typical guest experience during a busy night?",
            options: [
                { letter: 'A', text: "Food quality and consistency drop  - different standards on different nights", scores: { experience: 3 } },
                { letter: 'B', text: "Service feels rushed  - drinks not refilled, checks delayed, guests hurried", scores: { experience: 2, capacity: 1 } },
                { letter: 'C', text: "Service is fine but forgettable  - polite but no moments, no storytelling", scores: { behavior: 2 } },
                { letter: 'D', text: "Guests feel taken care of  - delivery is smooth, worth repeating", scores: {} }
            ]
        },
        {
            /* Q7  - BEHAVIOR ("Same menu. Same prices. Different outcome. That means framing.") */
            text: "Same menu, same prices  - does average check vary significantly by server?",
            options: [
                { letter: 'A', text: "Yes, hugely  - 30 to 40 percent difference", scores: { behavior: 2 } },
                { letter: 'B', text: "Some variation, not dramatic", scores: { behavior: 1 } },
                { letter: 'C', text: "Pretty consistent across the team", scores: {} },
                { letter: 'D', text: "I don\u2019t track this", scores: { behavior: 1, economics: 1 } }
            ]
        },
        {
            /* Q8  - BEHAVIOR signals (Beverage Attach Rate + Dessert Rate) */
            text: "What is happening with your beverage attach rate and dessert rate?",
            options: [
                { letter: 'A', text: "Both low  - guests order their meal and leave", scores: { behavior: 3 } },
                { letter: 'B', text: "Drinks are okay but desserts almost never happen", scores: { behavior: 2 } },
                { letter: 'C', text: "Both decent but could be higher", scores: { behavior: 1 } },
                { letter: 'D', text: "Strong  - guests explore the menu and add on naturally", scores: {} }
            ]
        },
        {
            /* Q9  - ECONOMICS ("Economics is NOT food cost %. It's prime cost engineering.") */
            text: "Do you know which items produce the most profit per labor minute  - and which ones are bleeders?",
            options: [
                { letter: 'A', text: "No  - I price based on gut feel or food cost percentage", scores: { economics: 3 } },
                { letter: 'B', text: "I know food costs but haven\u2019t factored in labor time per item", scores: { economics: 2 } },
                { letter: 'C', text: "Rough sense but no full prime cost analysis", scores: { economics: 1 } },
                { letter: 'D', text: "Yes  - I\u2019ve engineered around prime cost, know my heroes and bleeders", scores: {} }
            ]
        },
        {
            /* Q10  - PROFIT / system-level ("Compounding vs Surviving") */
            text: "Which best describes how you\u2019re operating right now?",
            options: [
                { letter: 'A', text: "Chasing daily sales targets, cutting labor when slow, discounting to hit numbers", scores: { profit: 2, capacity: 1 } },
                { letter: 'B', text: "Revenue is fine but nothing left at the end of the month  - busy but broke", scores: { economics: 2, capacity: 1 } },
                { letter: 'C', text: "Money is being left on the table every shift but can\u2019t pinpoint where", scores: { behavior: 2, economics: 1 } },
                { letter: 'D', text: "Profit is growing, tracking repeat rate, investing in capacity, engineering defaults", scores: {} }
            ]
        }
    ];

    /* ─── Results (all language from the Restaurant Money Model) ─── */
    var results = {
        demand: {
            icon: '\ud83d\udce3',
            title: 'DEMAND',
            quote: 'When seats are empty, operations aren\u2019t the constraint. Demand is. Before perfecting the system, earn the right to optimize it by filling the room.',
            description: 'Your restaurant\u2019s primary constraint is demand. The model is clear: when the dining room isn\u2019t full during peak windows, no amount of operational optimization matters. You cannot behavior-engineer, menu-engineer, or cost-cut your way to profit if the seats are empty. Demand must be solved first.',
            steps: [
                {
                    title: 'Build a Named Offer',
                    content: 'The model\u2019s Offer First framework: before spending on visibility, build something worth being visible for. A named, specific, compelling reason for a guest to choose your restaurant over every other option  - including staying home. Not \u201cgreat food and atmosphere.\u201d A real offer.'
                },
                {
                    title: 'Align the Team Before Going External',
                    content: 'The model\u2019s visibility sequence: Inside \u2192 Insight \u2192 Amplify \u2192 Own. Start with your current guests and staff (Inside). Learn what\u2019s actually working (Insight). Amplify what converts. Then build owned channels. Do not skip to paid ads.'
                },
                {
                    title: 'Remove Friction Between Attraction and Arrival',
                    content: 'The model\u2019s Access framework: once you have an offer and visibility, remove every barrier between \u201cI want to go\u201d and \u201cI\u2019m seated.\u201d Booking friction, parking confusion, unclear hours, poor signage  - these are demand killers hiding in plain sight.'
                }
            ],
            warning: {
                title: 'Wrong Moves the Model Warns Against',
                text: 'Cutting labor when demand is low: Fewer covers \u2192 panic \u2192 cut staff \u2192 worse experience when guests do come \u2192 fewer return visits \u2192 even fewer covers. This is the beginning of the death spiral. Discounting without a conversion path: attracts price buyers \u2192 compresses margins \u2192 creates labor pressure \u2192 the labor cycle repeats. The business trains guests to come for the discount, not the experience.'
            }
        },
        capacity: {
            icon: '\u2699\ufe0f',
            title: 'CAPACITY',
            quote: 'Capacity is not how many seats we have. Capacity is how many guests we can take care of while honoring the standard of experience we\u2019ve committed to creating.',
            description: 'Your primary constraint is capacity. You have the demand, but your operation cannot serve it without degrading the guest experience. The model defines capacity through three ceilings: FOH Server Capacity, Room Capacity, and Kitchen Capacity. Your True Guest Capacity equals the minimum of these three  - the lowest ceiling is the binding constraint.',
            steps: [
                {
                    title: 'Identify the Binding Ceiling',
                    content: 'True Guest Capacity = MIN(FOH Server Capacity, Room Capacity, Kitchen Capacity). Which ceiling is lowest? Watch the model\u2019s three Constraint Monitors: Host tracks Turn Time, Expo tracks Kitchen Chit Time, Bar tracks Bar Chit Time. Where times are stretching is where the ceiling lives.'
                },
                {
                    title: 'Target Capacity Load Between 0.75 and 0.90',
                    content: 'Capacity Load = Covers in Peak Window \u00f7 True Guest Capacity. The model\u2019s optimal zone is 0.75\u20130.90. Below 0.75, you\u2019re underutilizing. Above 0.90, experience starts degrading  - rushed service, mistakes, no time for behavioral guidance. Know your number.'
                },
                {
                    title: 'Raise the Ceiling Structurally',
                    content: 'The model provides four structural fixes: Section Geometry (optimize server sections for fewer steps, less cross-traffic), Temporal Staggering (spread arrivals to flatten the spike), Door Control (manage flow at the host stand), and Role Specialization (dedicate roles during peak instead of asking everyone to do everything).'
                }
            ],
            warning: {
                title: 'The Labor Percentage Trap',
                text: 'The model warns: chasing a labor percentage target by cutting staff is the wrong move when capacity is the constraint. If you are at 0.90+ Capacity Load and cut labor, you don\u2019t save money  - you destroy the experience, kill repeat visits, and start the death spiral. Labor percentage is a result, not a lever.'
            },
            crossLayer: {
                title: 'Cross-Layer Effect',
                text: 'When capacity is overloaded, it shows up everywhere downstream. Rushed service looks like an experience problem. Servers who can\u2019t guide look like a behavior problem. The model is explicit: when experience or behavior indicators decline, check CAPACITY before adjusting training, scripts, or pricing.'
            }
        },
        experience: {
            icon: '\u2728',
            title: 'EXPERIENCE',
            quote: 'Experience is the operational delivery of value  - converting a guest\u2019s time and attention into something worth repeating.',
            description: 'Your primary constraint is experience. Guests are coming in, your capacity can handle them, but the experience isn\u2019t converting first-time visitors into repeat guests. The model measures this through Experience Integrity Indicators: Turn Time stability, Complaints and Comps trending, and most critically  - Repeat Visit Rate.',
            steps: [
                {
                    title: 'Diagnose Through the Operational Value Equation',
                    content: 'The model defines operational value as: (What We Deliver \u00d7 Consistency) \u00f7 (Speed \u00d7 Friction). High delivery with poor consistency kills value. Fast service with high friction kills value. Identify which component is failing  - it\u2019s usually consistency or friction, not the offer itself.'
                },
                {
                    title: 'Check for Value Killers',
                    content: 'The model identifies four Value Killers: Cognitive Overload (too many choices, confusing menu), Attention Dilution (servers spread too thin to be present), Friction with Staff (awkward interactions, inattentive service), and Rushed Experience (capacity overload showing up as experience failure). Each has specific symptoms and metrics.'
                },
                {
                    title: 'Protect Lifetime Value',
                    content: 'LTV = Average Spend \u00d7 Visit Frequency \u00d7 Retention Period. The model states: one bad experience can destroy years of accumulated value. Experience isn\u2019t a soft metric  - it\u2019s the mechanism that converts single visits into compounding revenue.'
                }
            ],
            crossLayer: {
                title: 'Check Capacity First',
                text: 'The model\u2019s cross-layer diagnosis rule: when experience indicators decline, check CAPACITY before adjusting training, scripts, or pricing. Rushed experience is often capacity overload in disguise. If your Capacity Load is above 0.90, the experience problem may resolve by fixing the upstream constraint.'
            }
        },
        behavior: {
            icon: '\ud83e\udde0',
            title: 'BEHAVIOR',
            quote: 'Same menu. Same prices. Different outcome. That means framing, not economics. People do not resist price. They resist unexplained price.',
            description: 'Your primary constraint is behavior. Demand is there, capacity handles it, the experience is solid  - but guests aren\u2019t being guided to higher-value decisions. The model is clear: this is about framing, not selling. When average check varies by 30\u201340% between servers with the same menu and prices, the variable is behavioral guidance.',
            steps: [
                {
                    title: 'Verify Capacity Conditions First',
                    content: 'The model requires this check: behavioral guidance only works when servers have the time and space to guide. If Capacity Load is above 0.90, servers are in survival mode  - they can\u2019t frame, recommend, or create moments. Fix capacity before training behavior.'
                },
                {
                    title: 'Deploy Behavioral Monetization Vehicles',
                    content: 'The model defines five vehicles: Curated Pairings (suggest specific combinations), Chef Moments (create story-worthy interactions), Guided Progression (lead the meal arc from start to dessert), Bundles Near Singles (position a paired option next to the solo item), and Refill Prompts (systematic not random). These expand perceived value  - they don\u2019t pressure.'
                },
                {
                    title: 'Fix Emotional Flatness',
                    content: 'The model identifies Emotional Flatness as a value killer in the behavior layer: service is competent but creates no feeling. No surprise, no story, no moment the guest remembers. The fix isn\u2019t scripting  - it\u2019s creating the conditions where genuine moments can happen. Pressure shrinks value. Guidance expands it.'
                }
            ],
            warning: {
                title: 'Wrong Behavioral Fixes',
                text: 'The model warns against four traps: Don\u2019t sell harder (pressure shrinks value). Don\u2019t add more rules (rigidity kills authenticity). Don\u2019t remove choice (autonomy drives satisfaction). Don\u2019t discount (it trains guests to wait for deals instead of valuing the experience). Guidance expands value. Pressure contracts it.'
            }
        },
        economics: {
            icon: '\ud83d\udcca',
            title: 'ECONOMICS',
            quote: 'Economics is NOT food cost percentage. Economics is prime cost engineering.',
            description: 'Your primary constraint is economics. The upstream layers are working  - guests come in, capacity handles them, experience converts them, servers guide well  - but the items being sold aren\u2019t producing enough profit per constraint. The model redefines economics: it\u2019s not about food cost percentage, it\u2019s about prime cost per item, including the labor to produce it.',
            steps: [
                {
                    title: 'Calculate Item-Level Prime Cost',
                    content: 'Prime Cost = Ingredient Cost + Labor Cost (per item). The model uses the Economics Decision Grid: plot each item by Volume (how often ordered) and Prime Cost %. High Volume + Low Prime Cost = Heroes. High Volume + High Prime Cost = Bleeders draining profit on every order. Low Volume + High Prime Cost = Dead Weight. Low Volume + Low Prime Cost = Hidden Gems to promote.'
                },
                {
                    title: 'Make Low-Prime-Cost Items the Default',
                    content: 'The model\u2019s engineering principle: once you know which items are heroes, make them the default through framing and menu design. This isn\u2019t about removing items  - it\u2019s about guiding guests toward items that are both satisfying and profitable. Behavioral framing and economic engineering work together.'
                },
                {
                    title: 'Run the \u201cDon\u2019t Lie to Yourself\u201d Test',
                    content: 'The model\u2019s validation: Aggregate Prime Cost Target, Sales per Labor Hour (SPLH = Total Sales \u00f7 Total Labor Hours), and Profit per Labor Hour. If SPLH looks healthy but profit doesn\u2019t show up, your prime cost mix is wrong  - you\u2019re selling volume of the wrong items.'
                }
            ],
            warning: {
                title: 'The Cardinal Sin',
                text: 'The model\u2019s cardinal sin of restaurant economics: never cut labor before fixing conversion, framing, throughput, and menu engineering. Labor cuts reduce capacity, which degrades experience, which kills behavior, which makes economics worse. Work the sequence.'
            }
        },
        profit: {
            icon: '\ud83d\udcb0',
            title: 'PROFIT',
            quote: 'There are only two modes: compounding or surviving. Compounding means every operational dollar generates future value. Surviving means every dollar is spent staying open.',
            description: 'Your diagnostic points to the profit layer itself. The upstream layers may be functioning, but the business isn\u2019t compounding  - it\u2019s surviving. The model defines profit through three lenses: Net Profit Margin, Restaurant-Level Profit, and Profit per Labor Hour. \u201cBusy but broke\u201d is the model\u2019s term for when revenue looks fine but profit doesn\u2019t materialize.',
            steps: [
                {
                    title: 'Apply the Three Profit Lenses',
                    content: 'Net Profit Margin (is the overall business profitable?), Restaurant-Level Profit (is the unit itself generating cash after all operating costs?), and Profit per Labor Hour (is each hour of labor producing real profit, not just revenue?). The model requires all three  - one can mask problems in the others.'
                },
                {
                    title: 'Trace the Profit Cascade',
                    content: 'The model\u2019s Profit Cascade shows how upstream fixes compound: fixing demand fills the room \u2192 capacity converts it efficiently \u2192 experience creates repeat visits \u2192 behavior lifts check average \u2192 economics ensures each item contributes \u2192 profit emerges as the result of every layer working. Profit is not a lever. It\u2019s a result.'
                },
                {
                    title: 'Shift from Surviving to Compounding',
                    content: 'The model defines compounding as: investing in capacity, tracking repeat rate, engineering defaults, and building systems that get better over time. Surviving is: chasing daily sales targets, cutting labor when slow, discounting to hit numbers. The question isn\u2019t whether you\u2019re making money today  - it\u2019s whether today\u2019s operations create tomorrow\u2019s profit.'
                }
            ],
            warning: {
                title: 'Work Backward from the Guest',
                text: 'The model\u2019s Operator\u2019s Commandment: work backward from the guest, not forward from the numbers. When profit is the problem, the instinct is to look at the P&L and cut. The model says: look at the guest journey and build. Every profit problem traces back to one of the upstream layers.'
            }
        },
        mixed: {
            icon: '\ud83d\udd17',
            title: 'CROSS-LAYER CONSTRAINT',
            quote: 'Every restaurant is a system. When multiple layers are constrained, the model requires starting upstream  - because downstream fixes cannot hold if the foundation is unstable.',
            description: 'Your diagnostic shows constraints across multiple layers. This is common  - and it\u2019s exactly why the model insists on sequence. When two or more layers are elevated, the instinct is to fix what feels most urgent. The model says: start upstream. The upstream constraint is almost always causing or amplifying the downstream ones.',
            steps: [
                {
                    title: 'Start Upstream Per the Non-Negotiable Sequence',
                    content: 'DEMAND \u2192 CAPACITY \u2192 EXPERIENCE \u2192 BEHAVIOR \u2192 ECONOMICS \u2192 PROFIT. If both capacity and behavior are constrained, start with capacity  - because capacity overload prevents effective behavioral guidance. If both demand and experience are constrained, start with demand  - because you need guests in the room before experience optimization matters.'
                },
                {
                    title: 'Check for the Death Spiral',
                    content: 'The model\u2019s Death Spiral: capacity overload \u2192 less attention per guest \u2192 worse behavioral framing \u2192 lower conversion \u2192 revenue pressure \u2192 labor panic \u2192 cut staff \u2192 even more overload. If you see capacity, experience, AND behavior all elevated, this pattern may be active. The only exit is addressing capacity first  - not training harder, not selling harder, not cutting more.'
                },
                {
                    title: 'Work Backward from the Guest, Not Forward from the Numbers',
                    content: 'The model\u2019s Operator\u2019s Commandment. When everything feels broken, the instinct is to look at the P&L and react. The model says: trace the guest journey from arrival to departure. Where does it break first? That\u2019s your starting point. Fix that, then reassess  - the downstream symptoms may resolve on their own.'
                }
            ],
            warning: {
                title: 'Sequence Is Law',
                text: 'The model\u2019s core belief: you cannot optimize a downstream layer while the upstream layer is still constrained. Behavior cannot be fixed while capacity is overloaded. Experience cannot be fixed while demand is insufficient. Economics cannot be fixed while behavior is unguided. Start at the top. Work down. Reassess after each fix.'
            }
        }
    };

    /* ─── Scoring Logic (sequence-aware per the model) ─── */
    function determineBottleneck(scores) {
        var pcts = {};
        var order = ['demand', 'capacity', 'experience', 'behavior', 'economics', 'profit'];

        order.forEach(function (cat) {
            pcts[cat] = maxScores[cat] > 0 ? Math.round((scores[cat] / maxScores[cat]) * 100) : 0;
        });

        /* Sort all categories by percentage descending */
        var sorted = order.slice().sort(function (a, b) { return pcts[b] - pcts[a]; });

        /*
         * 1. Sequence-aware walk: diagnose the first upstream category >= 30%.
         *    "Sequence is Law"  - even if a downstream category scores highest,
         *    an elevated upstream category is diagnosed first.
         */
        for (var i = 0; i < order.length; i++) {
            if (pcts[order[i]] >= 30) {
                return { primary: order[i], pcts: pcts, sorted: sorted };
            }
        }

        /*
         * 2. Mixed detection: if no single category hits 30%, check whether
         *    the top two *measurable* categories (maxScore >= 5, excludes profit
         *    which has only one question) are both elevated and close together.
         */
        var measurable = order.filter(function (c) { return maxScores[c] >= 5; });
        var mSorted = measurable.slice().sort(function (a, b) { return pcts[b] - pcts[a]; });
        var top = mSorted[0];
        var second = mSorted[1];

        if (pcts[top] >= 25 && pcts[second] >= 25 && (pcts[top] - pcts[second]) <= 15) {
            return { primary: 'mixed', pcts: pcts, sorted: sorted };
        }

        /* 3. Fallback: highest scoring category */
        if (pcts[sorted[0]] > 0) {
            return { primary: sorted[0], pcts: pcts, sorted: sorted };
        }

        /* All zeros  - default to profit */
        return { primary: 'profit', pcts: pcts, sorted: sorted };
    }

    /* ─── DOM helpers ─── */
    function quizContainer() { return document.getElementById('quiz-container'); }
    function resultsContainer() { return document.getElementById('results-container'); }

    /* ─── Start / Reset ─── */
    function startQuiz() {
        state.currentQuestion = 0;
        state.answers = [];
        state.scores = { demand: 0, capacity: 0, experience: 0, behavior: 0, economics: 0, profit: 0 };
        resultsContainer().innerHTML = '';
        renderQuestion();
    }

    /* ─── Render current question ─── */
    function renderQuestion() {
        var q = questions[state.currentQuestion];
        var progress = ((state.currentQuestion) / questions.length) * 100;

        var html = '<div class="quiz-header">' +
            '<div class="progress-bar"><div class="progress-fill" style="width:' + progress + '%"></div></div>' +
            '<div class="question-counter">Question ' + (state.currentQuestion + 1) + ' of ' + questions.length + '</div>' +
            '</div>' +
            '<div class="question-card">' +
            '<div class="question-text">' + q.text + '</div>' +
            '<div class="options-grid">';

        q.options.forEach(function (opt, i) {
            html += '<div class="option-card" onclick="window.__diagnostic.handleAnswer(' + i + ')" role="button" tabindex="0">' +
                '<div class="option-letter">' + opt.letter + '</div>' +
                '<div class="option-text">' + opt.text + '</div>' +
                '</div>';
        });

        html += '</div></div>';

        if (state.currentQuestion > 0) {
            html += '<div class="quiz-nav">' +
                '<button class="back-button" onclick="window.__diagnostic.goBack()">\u2190 Back</button>' +
                '</div>';
        }

        quizContainer().innerHTML = html;
        quizContainer().scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* ─── Handle answer selection ─── */
    function handleAnswer(optionIndex) {
        var q = questions[state.currentQuestion];
        var chosen = q.options[optionIndex];

        /* Store answer index */
        state.answers[state.currentQuestion] = optionIndex;

        /* Accumulate scores */
        if (chosen.scores) {
            Object.keys(chosen.scores).forEach(function (cat) {
                state.scores[cat] += chosen.scores[cat];
            });
        }

        if (state.currentQuestion < questions.length - 1) {
            state.currentQuestion++;
            renderQuestion();
        } else {
            showResults();
        }
    }

    /* ─── Go back one question ─── */
    function goBack() {
        if (state.currentQuestion <= 0) return;

        /* Subtract previous answer's scores */
        var prevIndex = state.answers[state.currentQuestion - 1];
        if (prevIndex !== undefined) {
            var prevQ = questions[state.currentQuestion - 1];
            var prevScores = prevQ.options[prevIndex].scores;
            if (prevScores) {
                Object.keys(prevScores).forEach(function (cat) {
                    state.scores[cat] -= prevScores[cat];
                });
            }
        }

        state.currentQuestion--;
        renderQuestion();
    }

    /* ─── Show results ─── */
    function showResults() {
        quizContainer().innerHTML = '';

        var result = determineBottleneck(state.scores);
        var data = results[result.primary];
        var pcts = result.pcts;

        var html = '<div class="result-card">' +
            '<div class="result-header">' +
            '<div class="result-icon">' + data.icon + '</div>' +
            '<div class="result-label">Your Primary Constraint</div>' +
            '<h2 class="result-title ' + result.primary + '">' + data.title + '</h2>' +
            '</div>' +
            '<blockquote class="result-quote">\u201c' + data.quote + '\u201d</blockquote>' +
            '<div class="result-description">' + data.description + '</div>';

        /* Score breakdown */
        html += '<div class="score-breakdown"><h3>Your Score Breakdown</h3>';
        var order = ['demand', 'capacity', 'experience', 'behavior', 'economics', 'profit'];
        order.forEach(function (cat) {
            html += '<div class="score-bar-row">' +
                '<div class="score-bar-label">' + categoryLabels[cat] + '</div>' +
                '<div class="score-bar-track"><div class="score-bar-fill ' + cat + '" style="width:' + pcts[cat] + '%"></div></div>' +
                '<div class="score-bar-pct">' + pcts[cat] + '%</div>' +
                '</div>';
        });
        html += '</div>';

        /* Steps */
        html += '<div class="result-steps"><h3>What the Model Says to Do</h3>';
        data.steps.forEach(function (step, i) {
            html += '<div class="step-item">' +
                '<div class="step-number">' + (i + 1) + '</div>' +
                '<div class="step-content"><strong>' + step.title + '.</strong> ' + step.content + '</div>' +
                '</div>';
        });
        html += '</div>';

        /* Warning */
        if (data.warning) {
            html += '<div class="warning-box">' +
                '<h4>' + data.warning.title + '</h4>' +
                '<p>' + data.warning.text + '</p>' +
                '</div>';
        }

        /* Cross-layer note */
        if (data.crossLayer) {
            html += '<div class="cross-layer-note">' +
                '<h4>' + data.crossLayer.title + '</h4>' +
                '<p>' + data.crossLayer.text + '</p>' +
                '</div>';
        }

        /* Actions */
        html += '<div class="result-actions">' +
            '<button class="retake-button" onclick="window.__diagnostic.startQuiz()">Retake Diagnostic</button>' +
            '<button class="print-button" onclick="window.print()">Print Your Results</button>' +
            '</div></div>';

        resultsContainer().innerHTML = html;
        resultsContainer().scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* ─── Public API ─── */
    window.__diagnostic = { startQuiz: startQuiz, handleAnswer: handleAnswer, goBack: goBack };

    /* ─── Init ─── */
    document.addEventListener('DOMContentLoaded', startQuiz);
})();
