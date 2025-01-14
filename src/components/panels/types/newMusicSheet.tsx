import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import rpx from '@/utils/rpx';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import {Divider} from 'react-native-paper';
import MusicSheet from '@/core/musicSheet';
import {_usePanel} from '../usePanel';
import {fontSizeConst} from '@/constants/uiConst';
import Color from 'color';
import Button from '@/components/base/button';
import useColors from '@/hooks/useColors';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

interface INewMusicSheetProps {
    onSheetCreated?: (sheetId: string) => void;
    onCancel?: () => void;
}

export default function NewMusicSheet(props: INewMusicSheetProps) {
    const {onSheetCreated, onCancel} = props;

    const sheetRef = useRef<BottomSheetMethods | null>();
    const {unmountPanel} = _usePanel(sheetRef);
    const [input, setInput] = useState('');
    const colors = useColors();
    const snap = useRef(['30%']);

    return (
        <BottomSheet
            ref={_ => (sheetRef.current = _)}
            backgroundStyle={{backgroundColor: colors.primary}}
            backdropComponent={props => {
                return (
                    <BottomSheetBackdrop
                        disappearsOnIndex={-1}
                        pressBehavior={'close'}
                        opacity={0.5}
                        {...props}
                    />
                );
            }}
            handleComponent={null}
            index={0}
            snapPoints={snap.current}
            enablePanDownToClose
            enableOverDrag={false}
            onClose={unmountPanel}>
            <View style={style.opeartions}>
                <Button
                    onPress={() => {
                        onCancel ? onCancel() : unmountPanel();
                    }}>
                    取消
                </Button>
                <Button
                    onPress={async () => {
                        if (input) {
                            const sheetId = await MusicSheet.addSheet(input);
                            onSheetCreated?.(sheetId);
                            unmountPanel();
                        }
                    }}>
                    确认
                </Button>
            </View>
            <Divider />
            <BottomSheetTextInput
                value={input}
                onChangeText={_ => {
                    setInput(_);
                }}
                style={[
                    style.input,
                    {
                        color: colors.text,
                        backgroundColor: Color(colors.primary)
                            .lighten(0.7)
                            .toString(),
                    },
                ]}
                placeholderTextColor={colors.textSecondary}
                placeholder={'新建歌单'}
                maxLength={12}
            />
        </BottomSheet>
    );
}

const style = StyleSheet.create({
    wrapper: {
        width: rpx(750),
    },
    opeartions: {
        width: rpx(750),
        paddingHorizontal: rpx(24),
        flexDirection: 'row',
        height: rpx(100),
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    input: {
        marginTop: rpx(12),
        marginBottom: rpx(12),
        borderRadius: rpx(12),
        fontSize: fontSizeConst.content,
        lineHeight: fontSizeConst.content * 1.5,
        padding: rpx(12),
    },
});
