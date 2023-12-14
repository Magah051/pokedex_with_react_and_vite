import styled from "styled-components"
import { Button } from "../Button"
import { useInfoOption } from "../../providers/InfoOptionProvider"
import { BiUpArrow, BiDownArrow, BiRightArrow } from "react-icons/bi"

export function SecondaryOptionsButtons() {
    const { setOption } = useInfoOption()

    // Adicione as propriedades selectedOption e isDisable aos objetos Button
    const commonButtonProps = {
        selectedOption: [1, 2, 3], // Substitua pelo valor correto
        isDisable: false, // Substitua pelo valor correto
    }

    return (
        <Container>
            {/* Adicione as propriedades aos objetos Button */}
            <Button shape="arrow-up" keyName="ArrowUp" keyLabel={<BiUpArrow />} functionHandler={() => setOption(0)} {...commonButtonProps} />
            <Button shape="square" keyName="ArrowRight" keyLabel={<BiRightArrow />} functionHandler={() => setOption(2)} {...commonButtonProps} />
            <Button shape="arrow-down" keyName="ArrowDown" keyLabel={<BiDownArrow />} functionHandler={() => setOption(3)} {...commonButtonProps} />
        </Container>
    )
}

const Container = styled.div`
    width: 4rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`
