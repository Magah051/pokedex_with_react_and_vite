import styled from "styled-components"
import { usePokemonList } from "../providers/PokemonListProvider"
import { PokemonIco } from "./PokemonIco"
import { useEffect, useRef, useState } from "react"
import { DirectionalButtons } from "./DirectionalButtons"
import React from "react"
import { ActionButtons } from "./ActionButtons"
import { fixedNameMap } from "../utils/pokemons-fixed-names"
import { useCryAudio } from "../providers/CryAudioProvider"
import { useBeepAudio } from "../providers/BeepAudioProvider"
import { Keyboard } from "./KeyboardModal/Keyboard"
import { useSeachFilter } from "../providers/SearchFilterProvider"

const itemHeight = 34

const ListItem = React.memo(({
    index,
    pokemon,
    isSelected,
    setSelectedItemIndex
}: {
    index: number
    pokemon: { name: string, url: string }
    isSelected: boolean
    setSelectedItemIndex: (n: number) => void
}) => {
    let id = pokemon.url.split("pokemon/")[1].slice(0, -1)
    let fixedName
    if (pokemon.name.includes("-")) {
        const data = fixedNameMap.get(pokemon.name)
        fixedName = data!.name
    }

    const { fetchPokemon } = usePokemonList();
    return (
        <li
            onClick={() => {
                if (isSelected) {
                    fetchPokemon(parseInt(id)-1)
                } else {
                    setSelectedItemIndex(index)
                }
            }}
            style={{ cursor: "pointer" }}
        >
            <PokemonIco
                className={isSelected ? "wiggle" : ""}
                id={id}
                name={pokemon.name}
            />
            <PokeName>{fixedName ? fixedName : pokemon.name}</PokeName>
            <span>#{id.padStart(3, "0")}</span>
            {
                isSelected &&
                <ItemBorder>
                    <div>
                        <div></div>
                    </div>
                </ItemBorder>
            }

        </li>
    );
})

export function SearchDisplay() {

    const { pokemonList, selectedPokemon } = usePokemonList()
    const [filteredPokemonList, setFilteredPokemonList] = useState(pokemonList)
    const listSize = filteredPokemonList.length

    const [selectedItemIndex, setSelectedItemIndex] = useState(0)
    const [selectedItemId, setSelectedItemId] = useState(1)

    const listRef: React.RefObject<HTMLUListElement> = useRef(null);

    const { cryAudioRef } = useCryAudio()!
    const cryUrl = `/audios/cries/${selectedPokemon.id}.wav`

    const { playBeep } = useBeepAudio()!
    const [isFirstBeep, setIsFirstBeep] = useState(true)

    const { filterText, isInputFocus } = useSeachFilter();

    function moveSelectorUp(n: number) {
        if (selectedItemIndex > n - 1) {
            let newSelectionPosition = selectedItemIndex - n
            setSelectedItemIndex(newSelectionPosition)
            if (listRef.current) {
                let currentScrollY = listRef.current.scrollTop
                if (
                    newSelectionPosition * itemHeight < currentScrollY ||
                    newSelectionPosition * itemHeight > currentScrollY + (itemHeight * 5)
                ) {
                    listRef.current.scrollTop = newSelectionPosition * itemHeight
                }
            }
        }
    }

    function moveSelectorDown(n: number) {
        if (selectedItemIndex < listSize - n) {
            let newSelectionPosition = selectedItemIndex + n
            setSelectedItemIndex(newSelectionPosition)

            if (listRef.current) {
                let currentScrollY = listRef.current.scrollTop
                if (
                    newSelectionPosition * itemHeight < currentScrollY ||
                    newSelectionPosition * itemHeight > currentScrollY + (itemHeight * 4)
                ) {
                    listRef.current.scrollTop = (newSelectionPosition * itemHeight) - (itemHeight * 4)
                }
            }
        }
    }

    useEffect(()=>{
        setSelectedItemIndex(0)
        setFilteredPokemonList(pokemonList.filter(p => p.name.includes(filterText.toLocaleLowerCase())))
    }, [filterText])

    useEffect(() => {
        if (isFirstBeep) {
            setIsFirstBeep(false)
        } else {
            setSelectedItemId(parseInt(filteredPokemonList[selectedItemIndex].url.split("pokemon/")[1].slice(0, -1)))
            playBeep()
        }
    }, [selectedItemIndex, selectedPokemon])

    return <>
        <Container>
            <DirectionalButtons
                selectedItemIndex={selectedItemIndex}
                moveSelectorUp={moveSelectorUp}
                moveSelectorDown={moveSelectorDown}
                isDisable={isInputFocus}
            />
            <DisplayContainer>
                <Wrapper>
                    <div className="overlay" />
                    <ul ref={listRef}>
                        {
                            !pokemonList
                                ? "Loading..."
                                : filteredPokemonList
                                    .map((pokemon, index) => {
                                        return (
                                            <ListItem
                                                key={index}
                                                index={index}
                                                pokemon={pokemon}
                                                isSelected={index === selectedItemIndex}
                                                setSelectedItemIndex={setSelectedItemIndex}
                                            />
                                        )
                                    }
                                    )
                        }
                    </ul>
                    <Keyboard />
                </Wrapper>
            </DisplayContainer>
            <ActionButtons
                selectedItemId={selectedItemId}
                pokemonListIndex={selectedItemIndex}
                isDisable={isInputFocus}
            />

            {/* audio component to emit pokemon cries */}
            <audio ref={cryAudioRef} src={cryUrl} />
        </Container>
    </>
}

const Container = styled.section`
    display: flex;
    gap: 1rem;
    align-items: center;
    padding: 0 2rem;

    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */

    @media (max-width: 420px){
        padding: 0 1rem;
        width: 100%;
        justify-content: space-around;
    }
`

const DisplayContainer = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background-color: white;
    width: 22.6rem;
    overflow: hidden;
    border-radius: 1rem;
    padding: 0rem;
    background-color: var(--shadow-color);
    padding-top: 0.4rem;

`

const Wrapper = styled.div`
    position: relative;
    width: 25.6rem;
    height: calc(${itemHeight} * 5px + 3px);
    background-color: white;
    border-radius: 1rem;
    overflow: hidden;

    & > ul {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        padding: 0.2rem;

        & li {
            position: relative;
            color: var(--game-font-color);
            padding: 0.2rem 1rem 0.2rem 0;
            display: flex;
            align-items: flex-end;
            gap: 0.4rem;
            font-size: 1.2rem;
            text-transform: capitalize;
            letter-spacing: 0.1rem;
            text-shadow: 
                0px 1px 0px var(--game-font-shadow),
                1px 0px 0px var(--game-font-shadow),
                1px 1px 0px var(--game-font-shadow)
            ;

            & > span {
                line-height: 1.4rem;
                padding: 0.6rem 0;
            }

            & .wiggle {
                // transform: scaleY(-1);
                animation: 0.3s wiggle linear infinite;
            }
        }
    }
`

const ItemBorder = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    border: 0.2rem solid white;
    border-radius: 1rem;
    display: flex;
    box-shadow: 
        1px 1px 0px var(--cyan),
        -1px -1px 0px var(--cyan),
        -1px 1px 0px var(--cyan),
        1px -1px 0px var(--cyan),
        inset 1px 1px 0px var(--cyan),
        inset -1px -1px 0px var(--cyan),
        inset -1px 1px 0px var(--cyan),
        inset 1px -1px 0px var(--cyan)
        ;

    
`

const PokeName = styled.span`
    flex-grow: 1;
    overflow: hidden;
    display: flex;
`