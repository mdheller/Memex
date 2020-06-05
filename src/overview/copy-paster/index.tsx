import React, { PureComponent } from 'react'
import styled from 'styled-components'
import onClickOutside from 'react-onclickoutside'
import { Template } from './types'
import TemplateEditor from './components/TemplateEditor'
import TemplateList from './components/TemplateList'

const CopyPasterWrapper = styled.div`
    padding: 0 8px 8px;
`

interface CopyPasterProps {
    templates: Template[]
    copyPasterEditingId: number | null

    onClickNew: () => void
    onClickEdit: (id: number) => void
    onClick: (id: number) => void
    onClickCancel: () => void
    onClickSave: (id: number) => void
    onClickDelete: (id: number) => void
    onClickHowto: () => void

    onTitleChange: (id: number, title: string) => void
    onCodeChange: (id: number, code: string) => void
    onSetIsFavourite: (id: number, isFavourite: boolean) => void

    onClickOutside?: () => void
}

class CopyPaster extends PureComponent<CopyPasterProps> {
    handleClickOutside = () => {
        if (this.props.onClickOutside) {
            this.props.onClickOutside()
        }
    }

    render() {
        const { copyPasterEditingId, templates } = this.props

        return (
            <CopyPasterWrapper>
                {copyPasterEditingId ? (
                    <TemplateEditor
                        template={templates.find(
                            (t) => t.id === copyPasterEditingId,
                        )}
                        onClickSave={() =>
                            this.props.onClickSave(copyPasterEditingId)
                        }
                        onClickCancel={this.props.onClickCancel}
                        onClickDelete={() =>
                            this.props.onClickDelete(copyPasterEditingId)
                        }
                        onClickHowto={this.props.onClickHowto}
                        onTitleChange={(s) =>
                            this.props.onTitleChange(copyPasterEditingId, s)
                        }
                        onCodeChange={(s) =>
                            this.props.onCodeChange(copyPasterEditingId, s)
                        }
                    />
                ) : (
                    <TemplateList
                        isLoading={false}
                        templates={templates}
                        onClickSetIsFavourite={this.props.onSetIsFavourite}
                        onClickEdit={(id) => this.props.onClickEdit(id)}
                        onClickNew={this.props.onClickNew}
                        onClick={this.props.onClick}
                    />
                )}
            </CopyPasterWrapper>
        )
    }
}

export default onClickOutside(CopyPaster)