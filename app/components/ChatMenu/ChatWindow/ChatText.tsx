import { Chats, MarkdownStyle } from 'constants/Global'
import React, { useEffect, useRef } from 'react'
import { View, Animated, Easing, useAnimatedValue } from 'react-native'
import Markdown from 'react-native-markdown-display'

type ChatTextProps = {
    nowGenerating: boolean
    id: number
}

const ChatText: React.FC<ChatTextProps> = ({ nowGenerating, id }) => {
    const { swipeText } = Chats.useSwipeData(id)
    const viewRef = useRef<View>(null)

    const animHeight = useAnimatedValue(-1)
    const targetHeight = useRef(-1)
    const firstRender = useRef(true)

    const handleAnimateHeight = (newheight: number) => {
        animHeight.stopAnimation(() =>
            Animated.timing(animHeight, {
                toValue: newheight,
                duration: 150,
                useNativeDriver: false,
                easing: Easing.inOut((x) => x * x),
            }).start()
        )
    }

    const updateHeight = () => {
        if (viewRef.current) {
            viewRef.current.measure((x, y, width, measuredHeight) => {
                if (targetHeight.current === measuredHeight) return
                handleAnimateHeight(measuredHeight)
                targetHeight.current = measuredHeight
            })
        }
    }

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            return
        }
        requestAnimationFrame(() => updateHeight())
    }, [swipeText])

    return (
        <Animated.View style={{ overflow: 'scroll', height: animHeight }}>
            <View style={{ minHeight: 10 }} ref={viewRef}>
                <Markdown
                    markdownit={MarkdownStyle.Rules}
                    rules={MarkdownStyle.RenderRules}
                    style={MarkdownStyle.Styles}>
                    {swipeText.trim()}
                </Markdown>
            </View>
        </Animated.View>
    )
}

export default ChatText
