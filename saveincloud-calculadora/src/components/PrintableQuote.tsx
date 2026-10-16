import {
  forwardRef,
} from 'react';

import {
  getStackById,
} from '../data/stacks';

import type {
  Infrastructure,
  PriceResult,
} from '../types/infrastructure';

interface PrintableQuoteProps {
  infrastructure: Infrastructure;
  price: PriceResult;
}

function formatBRL(
  value: number
): string {
  return value.toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}

const PrintableQuote =
  forwardRef<
    HTMLDivElement,
    PrintableQuoteProps
  >(
    function PrintableQuote(
      {
        infrastructure,
        price,
      },
      ref
    ) {
      return (
        <div
          ref={ref}
          className="printable-quote"
        >
          <header>
            <div>
              <strong>
                SaveInCloud
              </strong>
              <span>
                Calculadora de infraestrutura
              </span>
            </div>

            <span>
              Estimativa de infraestrutura
            </span>
          </header>

          <div className="printable-quote-summary">
            <div>
              <span>
                DE
              </span>
              <strong>
                {formatBRL(
                  price.minimumPayable.monthly
                )}
                <small>
                  / mês
                </small>
              </strong>
            </div>

            <div>
              <span>
                PARA
              </span>
              <strong>
                {formatBRL(
                  price.maximumPayable.monthly
                )}
                <small>
                  / mês
                </small>
              </strong>
            </div>
          </div>

          <h2>
            Arquitetura
          </h2>

          <table>
            <thead>
              <tr>
                <th>
                  Camada
                </th>
                <th>
                  Stack
                </th>
                <th>
                  Node
                </th>
                <th>
                  Cloudlets
                </th>
                <th>
                  Storage
                </th>
              </tr>
            </thead>

            <tbody>
              {infrastructure.nodes.map(
                (node) => {
                  const stack =
                    getStackById(
                      node.stackId
                    );

                  return (
                    <tr
                      key={
                        node.id
                      }
                    >
                      <td>
                        {node.layer}
                      </td>
                      <td>
                        {stack?.name ??
                          node.stackId}
                      </td>
                      <td>
                        {node.name}
                      </td>
                      <td>
                        {node.reservedCloudlets}
                        {' → '}
                        {node.dynamicCloudlets}
                      </td>
                      <td>
                        {node.storageGB} GB
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>

          <h2>
            Resumo de custos
          </h2>

          <table>
            <tbody>
              <tr>
                <td>
                  Total DE
                </td>
                <td>
                  {formatBRL(
                    price.minimum.hourly
                  )}{' '}
                  / h
                </td>
                <td>
                  {formatBRL(
                    price.minimum.monthly
                  )}{' '}
                  / mês
                </td>
              </tr>

              <tr>
                <td>
                  Desconto DE
                </td>
                <td>
                  -{formatBRL(
                    price.minimumSavings.hourly
                  )}{' '}
                  / h
                </td>
                <td>
                  -{formatBRL(
                    price.minimumSavings.monthly
                  )}{' '}
                  / mês
                </td>
              </tr>

              <tr>
                <td>
                  Total a pagar DE
                </td>
                <td>
                  {formatBRL(
                    price.minimumPayable.hourly
                  )}{' '}
                  / h
                </td>
                <td>
                  {formatBRL(
                    price.minimumPayable.monthly
                  )}{' '}
                  / mês
                </td>
              </tr>

              <tr>
                <td>
                  Total PARA
                </td>
                <td>
                  {formatBRL(
                    price.maximum.hourly
                  )}{' '}
                  / h
                </td>
                <td>
                  {formatBRL(
                    price.maximum.monthly
                  )}{' '}
                  / mês
                </td>
              </tr>

              <tr>
                <td>
                  Desconto PARA
                </td>
                <td>
                  -{formatBRL(
                    price.maximumSavings.hourly
                  )}{' '}
                  / h
                </td>
                <td>
                  -{formatBRL(
                    price.maximumSavings.monthly
                  )}{' '}
                  / mês
                </td>
              </tr>

              <tr>
                <td>
                  Total a pagar PARA
                </td>
                <td>
                  {formatBRL(
                    price.maximumPayable.hourly
                  )}{' '}
                  / h
                </td>
                <td>
                  {formatBRL(
                    price.maximumPayable.monthly
                  )}{' '}
                  / mês
                </td>
              </tr>
            </tbody>
          </table>

          <footer>
            Valores estimados com base nos recursos
            configurados na calculadora.
          </footer>
        </div>
      );
    }
  );

export default PrintableQuote;
