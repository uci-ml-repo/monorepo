import { PrismaClient } from '@prisma/client'
import BaseDatabaseService from './base_database_service'

const checkIfEmpty = (val: unknown) => {
  return val == null || val === ''
}

class AttributesService extends BaseDatabaseService {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  async getTable(datasetID: number) {
    const headers = [
      'ID',
      'Attribute Name',
      'Role',
      'Type',
      'Description',
      'Units',
      'Missing Values',
    ]

    const attributes = await this.prisma.attributes.findMany({
      where: {
        datasetID,
      },
    })

    return {
      headers,
      data:
        attributes.map((row) => [
          row.ID,
          row.name,
          row.role || '',
          row.type,
          row.description || '',
          row.units || '',
          Boolean(row.missingValues),
        ]) || [],
    }
  }

  async getQA(ID: number) {
    const AttributeHeaders = [
      { key: 0, label: 'Attribute Name' },
      { key: 1, label: 'Role' },
      { key: 2, label: 'Type' },
      { key: 3, label: 'Description' },
      { key: 4, label: 'Units' },
      { key: 5, label: 'Missing Values' },
    ]
    const dataset = await this.prisma.donated_datasets.findFirst({
      where: {
        ID,
      },
      select: {
        attributes: true,
      },
    })
    const attributes =
      dataset?.attributes.map((attribute) => [
        {
          label: checkIfEmpty(attribute.name) ? 'N/A' : attribute.name,
          value: attribute.name,
        },
        {
          label: checkIfEmpty(attribute.role) ? 'N/A' : attribute.role,
          value: attribute.role,
        },
        {
          label: checkIfEmpty(attribute.type) ? 'N/A' : attribute.type,
          value: attribute.type,
        },
        {
          label: checkIfEmpty(attribute.description) ? 'N/A' : attribute.description,
          value: attribute.description,
        },
        {
          label: checkIfEmpty(attribute.units) ? 'N/A' : attribute.units,
          value: attribute.units,
        },
        {
          label: checkIfEmpty(attribute.missingValues)
            ? 'N/A'
            : attribute.missingValues
            ? 'True'
            : 'False',
          value: attribute.missingValues,
        },
      ]) || []
    return { headers: AttributeHeaders, data: attributes }
  }
}

export default AttributesService
