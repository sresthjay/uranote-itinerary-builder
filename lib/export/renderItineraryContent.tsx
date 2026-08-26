import {
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

/*
|--------------------------------------------------------------------------
| Itinerary Styles
|--------------------------------------------------------------------------
|
| These styles intentionally match the main CustomerItineraryPDF:
|
| Font:
|   Montserrat
|
| Colors:
|   text       #263238
|   tealDark   #103C3F
|   teal       #164E52
|   amber      #C8923E
|
|--------------------------------------------------------------------------
*/

const styles = StyleSheet.create({
    /*
    |--------------------------------------------------------------------------
    | Paragraph
    |--------------------------------------------------------------------------
    */

    paragraph: {
        fontFamily: "Montserrat",
        fontSize: 11,
        fontWeight: 400,

        color: "#000000",

        lineHeight: 1.75,

        marginBottom: 9,
    },

    /*
    |--------------------------------------------------------------------------
    | Heading 2
    |--------------------------------------------------------------------------
    */

    heading2: {
        fontFamily: "Montserrat",
        fontSize: 15,
        fontWeight: 600,

        color: "#103C3F",

        marginTop: 14,
        marginBottom: 7,

        lineHeight: 1.45,
    },

    /*
    |--------------------------------------------------------------------------
    | Heading 3
    |--------------------------------------------------------------------------
    */

    heading3: {
        fontFamily: "Montserrat",
        fontSize: 12,
        fontWeight: 600,

        color: "#164E52",

        marginTop: 11,
        marginBottom: 5,

        lineHeight: 1.4,
    },

    /*
    |--------------------------------------------------------------------------
    | Bullet
    |--------------------------------------------------------------------------
    */

    bullet: {
        flexDirection: "row",

        width: "100%",

        marginBottom: 5,

        paddingLeft: 6,
    },

    bulletSymbol: {
        width: 12,

        fontFamily: "Montserrat",
        fontSize: 10,
        fontWeight: 500,

        color: "#C8923E",

        lineHeight: 1.55,
    },

    bulletText: {
        flex: 1,

        fontFamily: "Montserrat",
        fontSize: 11,
        fontWeight: 400,

        color: "#263238",

        lineHeight: 1.55,
    },

    /*
    |--------------------------------------------------------------------------
    | Ordered List
    |--------------------------------------------------------------------------
    */

    orderedItem: {
        flexDirection: "row",

        width: "100%",

        marginBottom: 5,

        paddingLeft: 6,
    },

    orderedNumber: {
        width: 18,

        fontFamily: "Montserrat",
        fontSize: 10,
        fontWeight: 500,

        color: "#C8923E",

        lineHeight: 1.55,
    },

    orderedText: {
        flex: 1,

        fontFamily: "Montserrat",
        fontSize: 11,
        fontWeight: 400,

        color: "#263238",

        lineHeight: 1.55,
    },
});

/*
|--------------------------------------------------------------------------
| Decode HTML entities
|--------------------------------------------------------------------------
*/

function decodeEntities(value: string) {
    return value
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">");
}

/*
|--------------------------------------------------------------------------
| Remove inline HTML while preserving text
|--------------------------------------------------------------------------
*/

function stripInlineHtml(value: string) {
    return decodeEntities(
        value
            .replace(/<br\s*\/?>/gi, " ")
            .replace(/<strong[^>]*>/gi, "")
            .replace(/<\/strong>/gi, "")
            .replace(/<b[^>]*>/gi, "")
            .replace(/<\/b>/gi, "")
            .replace(/<em[^>]*>/gi, "")
            .replace(/<\/em>/gi, "")
            .replace(/<i[^>]*>/gi, "")
            .replace(/<\/i>/gi, "")
            .replace(/<[^>]+>/g, "")
    ).trim();
}

/*
|--------------------------------------------------------------------------
| Extract block contents
|--------------------------------------------------------------------------
*/

function extractBlocks(
    html: string,
    tag: string
) {
    const regex = new RegExp(
        `<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`,
        "gi"
    );

    return [...html.matchAll(regex)].map(
        (match) => match[1]
    );
}

/*
|--------------------------------------------------------------------------
| Render inline text
|--------------------------------------------------------------------------
*/

function renderInlineText(html: string) {
    return stripInlineHtml(html);
}

/*
|--------------------------------------------------------------------------
| Render Tiptap HTML
|--------------------------------------------------------------------------
|
| Supported:
|
|   <p>
|   <h2>
|   <h3>
|   <ul>
|   <ol>
|
|--------------------------------------------------------------------------
*/

export function renderItineraryContent(
    html: string
) {
    if (!html?.trim()) {
        return null;
    }

    const blocks: React.ReactNode[] = [];

    /*
    |--------------------------------------------------------------------------
    | Temporarily replace lists with tokens
    |--------------------------------------------------------------------------
    */

    const listBlocks: string[] = [];

    const processedHtml = html.replace(
        /<(ul|ol)[^>]*>[\s\S]*?<\/\1>/gi,
        (match) => {
            const index = listBlocks.length;

            listBlocks.push(match);

            return `___LIST_BLOCK_${index}___`;
        }
    );

    /*
    |--------------------------------------------------------------------------
    | Split document into blocks
    |--------------------------------------------------------------------------
    */

    const blockRegex =
        /(<h2[^>]*>[\s\S]*?<\/h2>|<h3[^>]*>[\s\S]*?<\/h3>|<p[^>]*>[\s\S]*?<\/p>|___LIST_BLOCK_\d+___)/gi;

    const parts = processedHtml
        .split(blockRegex)
        .map((part) => part.trim())
        .filter(Boolean);

    /*
    |--------------------------------------------------------------------------
    | Render blocks
    |--------------------------------------------------------------------------
    */

    parts.forEach((part, index) => {
        /*
        |--------------------------------------------------------------------------
        | List
        |--------------------------------------------------------------------------
        */

        const listToken = part.match(
            /^___LIST_BLOCK_(\d+)___$/
        );

        if (listToken) {
            const listHtml =
                listBlocks[Number(listToken[1])];

            const ordered =
                /^<ol/i.test(listHtml);

            const items = extractBlocks(
                listHtml,
                "li"
            );

            items.forEach(
                (item, itemIndex) => {
                    if (ordered) {
                        blocks.push(
                            <View
                                key={`${index}-ordered-${itemIndex}`}
                                style={
                                    styles.orderedItem
                                }
                            >
                                <Text
                                    style={
                                        styles.orderedNumber
                                    }
                                >
                                    {itemIndex + 1}.
                                </Text>

                                <Text
                                    style={
                                        styles.orderedText
                                    }
                                >
                                    {renderInlineText(
                                        item
                                    )}
                                </Text>
                            </View>
                        );
                    } else {
                        blocks.push(
                            <View
                                key={`${index}-bullet-${itemIndex}`}
                                style={
                                    styles.bullet
                                }
                            >
                                <Text
                                    style={
                                        styles.bulletSymbol
                                    }
                                >
                                    •
                                </Text>

                                <Text
                                    style={
                                        styles.bulletText
                                    }
                                >
                                    {renderInlineText(
                                        item
                                    )}
                                </Text>
                            </View>
                        );
                    }
                }
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | H2
        |--------------------------------------------------------------------------
        */

        const h2 = part.match(
            /^<h2[^>]*>([\s\S]*?)<\/h2>$/i
        );

        if (h2) {
            blocks.push(
                <Text
                    key={index}
                    style={styles.heading2}
                >
                    {renderInlineText(h2[1])}
                </Text>
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | H3
        |--------------------------------------------------------------------------
        */

        const h3 = part.match(
            /^<h3[^>]*>([\s\S]*?)<\/h3>$/i
        );

        if (h3) {
            blocks.push(
                <Text
                    key={index}
                    style={styles.heading3}
                >
                    {renderInlineText(h3[1])}
                </Text>
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Paragraph
        |--------------------------------------------------------------------------
        */

        const paragraph = part.match(
            /^<p[^>]*>([\s\S]*?)<\/p>$/i
        );

        if (paragraph) {
            const text =
                renderInlineText(paragraph[1]);

            if (text) {
                blocks.push(
                    <Text
                        key={index}
                        style={styles.paragraph}
                    >
                        {text}
                    </Text>
                );
            }

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Fallback
        |--------------------------------------------------------------------------
        */

        const fallback =
            renderInlineText(part);

        if (fallback) {
            blocks.push(
                <Text
                    key={index}
                    style={styles.paragraph}
                >
                    {fallback}
                </Text>
            );
        }
    });

    return blocks;
}